
import asyncio
import uuid
from datetime import datetime, timedelta
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from backend.database import engine, init_db, get_session
from backend.models import User, UserRole, Invoice, InvoiceStatus, RiskAssessment
from backend.auth import get_password_hash
from backend.utils.qr_generator import generate_invoice_qr

async def seed_data():
    print("Initializng database...")
    await init_db()
    
    async for session in get_session():
        # Check if we already have users
        statement = select(User)
        result = await session.exec(statement)
        if result.first():
            print("Database already contains data, skipping seeding.")
            return

        print("Seeding users...")
        users_to_create = [
            {
                "email": "admin@kaziflow.com",
                "full_name": "System Administrator",
                "role": UserRole.ADMIN,
                "company_name": "KaziFlow HQ",
                "password": "password123"
            },
            {
                "email": "bank@bk.rw",
                "full_name": "BK Financing Officer",
                "role": UserRole.BANK,
                "company_name": "Bank of Kigali",
                "password": "password123"
            },
            {
                "email": "simba@retail.rw",
                "full_name": "Simba Supermarket Manager",
                "role": UserRole.RETAILER,
                "company_name": "Simba Supermarket",
                "password": "password123"
            },
            {
                "email": "vendor@agri.rw",
                "full_name": "Jean Bosco",
                "role": UserRole.VENDOR,
                "company_name": "Bosco Agri-Supplies",
                "password": "password123"
            },
            {
                "email": "farmer@coop.rw",
                "full_name": "Alice Mutoni",
                "role": UserRole.VENDOR,
                "company_name": "Musanze Farmer Group",
                "password": "password123"
            }
        ]

        created_users = {}
        for u_data in users_to_create:
            hashed = get_password_hash(u_data.pop("password"))
            user = User(**u_data, hashed_password=hashed)
            session.add(user)
            created_users[u_data["email"]] = user
        
        await session.commit()
        for u in created_users.values():
            await session.refresh(u)

        print("Seeding invoices...")
        vendor = created_users["vendor@agri.rw"]
        retailer = created_users["simba@retail.rw"]
        
        invoices = [
            Invoice(
                amount=750000,
                description="Supply of 500kg Premium Coffee Beans",
                status=InvoiceStatus.APPROVED,
                due_date=datetime.utcnow() + timedelta(days=30),
                vendor_id=vendor.id,
                retailer_id=retailer.id,
                is_verified=True,
                ai_risk_score=92
            ),
            Invoice(
                amount=1200000,
                description="Delivery of Organic Fertilizer - Batch 44",
                status=InvoiceStatus.PENDING,
                due_date=datetime.utcnow() + timedelta(days=45),
                vendor_id=vendor.id,
                retailer_id=retailer.id,
                is_verified=False
            ),
            Invoice(
                amount=300000,
                description="Fresh Vegetables - Weekly Supply",
                status=InvoiceStatus.PAID,
                due_date=datetime.utcnow() - timedelta(days=5),
                vendor_id=created_users["farmer@coop.rw"].id,
                retailer_id=retailer.id,
                is_verified=True,
                ai_risk_score=85
            )
        ]

        for inv in invoices:
            session.add(inv)
        
        await session.commit()
        for inv in invoices:
            await session.refresh(inv)
            # Generate QR code after commit to have the ID
            inv.qr_code = generate_invoice_qr(str(inv.id))
            session.add(inv)
            
        await session.commit()
        print("Data seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
