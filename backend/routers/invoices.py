from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from backend.database import get_session
from backend.auth import get_current_user
from backend.models import User, Invoice, InvoiceStatus
from backend.utils.qr_generator import generate_invoice_qr

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get("/", response_model=List[Invoice])
async def get_invoices(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Vendor sees only their invoices
    if current_user.role == "vendor":
        statement = select(Invoice).where(Invoice.vendor_id == current_user.id)
    # Retailer/Bank/Admin might see all (simplified logic for now)
    else:
        statement = select(Invoice)
        
    result = await session.exec(statement)
    return result.all()

@router.post("/", response_model=Invoice)
async def create_invoice(
    invoice: Invoice,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if current_user.role != "vendor":
        # Only vendors can upload invoices typically
        pass 

    invoice.vendor_id = current_user.id
    session.add(invoice)
    await session.commit()
    await session.refresh(invoice)
    
    # Generate QR code
    invoice.qr_code = generate_invoice_qr(str(invoice.id))
    session.add(invoice)
    await session.commit()
    await session.refresh(invoice)
    
    return invoice
