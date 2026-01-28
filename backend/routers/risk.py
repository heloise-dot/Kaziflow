from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from backend.database import get_session
from backend.auth import get_current_user
from backend.models import User, RiskAssessment
from backend.services.ai_service import analyze_vendor_risk

router = APIRouter(prefix="/risk", tags=["risk"])

@router.post("/analyze/{vendor_id}", response_model=RiskAssessment)
async def analyze_risk(
    vendor_id: str, 
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Only Bank or Admin can run analysis
    if current_user.role not in ["bank", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    # In a real app, we would fetch vendor invoice history here
    # For now, we mock the data passing to AI
    vendor_data = {
        "id": vendor_id,
        "transaction_volume": 50000,
        "history_years": 2,
        "late_deliveries": 1
    }

    analysis_result = await analyze_vendor_risk(vendor_data)

    risk_record = RiskAssessment(
        vendor_id=vendor_id, # Assuming UUID is passed as string
        score=analysis_result.get("score", 0),
        level=analysis_result.get("level", "Unknown"),
        reasoning=analysis_result.get("reasoning", ""),
        factors=analysis_result.get("factors", [])
    )
    
    session.add(risk_record)
    await session.commit()
    await session.refresh(risk_record)
    
    return risk_record
