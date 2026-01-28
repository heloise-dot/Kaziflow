from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from backend.database import get_session
from backend.auth import get_current_user
from backend.models import User, Notification

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[Notification])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    statement = select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc())
    result = await session.exec(statement)
    return result.all()

@router.post("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    statement = select(Notification).where(Notification.id == notification_id, Notification.user_id == current_user.id)
    result = await session.exec(statement)
    notification = result.first()
    if notification:
        notification.is_read = True
        session.add(notification)
        await session.commit()
    return {"status": "success"}
