from typing import Optional, List, Dict
from sqlmodel import SQLModel, Field, Relationship, JSON
from enum import Enum
from datetime import datetime
import uuid

class UserRole(str, Enum):
    VENDOR = "vendor"
    RETAILER = "retailer"
    BANK = "bank"
    ADMIN = "admin"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: str
    role: UserRole = Field(default=UserRole.VENDOR)
    company_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(max_length=72)

class User(UserBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    
    invoices_as_vendor: List["Invoice"] = Relationship(back_populates="vendor", sa_relationship_kwargs={"foreign_keys": "[Invoice.vendor_id]"})
    invoices_as_retailer: List["Invoice"] = Relationship(back_populates="retailer", sa_relationship_kwargs={"foreign_keys": "[Invoice.retailer_id]"})
    risk_assessments: List["RiskAssessment"] = Relationship(back_populates="vendor")

class InvoiceStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"
    FINANCED = "financed"

class Invoice(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    amount: float
    description: str
    status: InvoiceStatus = Field(default=InvoiceStatus.PENDING)
    due_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    vendor_id: uuid.UUID = Field(foreign_key="user.id")
    vendor: "User" = Relationship(back_populates="invoices_as_vendor", sa_relationship_kwargs={"foreign_keys": "[Invoice.vendor_id]"})
    
    retailer_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id")
    retailer: Optional["User"] = Relationship(back_populates="invoices_as_retailer", sa_relationship_kwargs={"foreign_keys": "[Invoice.retailer_id]"})
    qr_code: Optional[str] = Field(default=None) # Base64 QR Code
    is_verified: bool = Field(default=False)
    ai_risk_score: Optional[int] = Field(default=None)

class RiskAssessment(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    score: int
    level: str
    reasoning: str
    factors: List[Dict] = Field(default=[], sa_type=JSON)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    vendor_id: uuid.UUID = Field(foreign_key="user.id")
    vendor: User = Relationship(back_populates="risk_assessments")

class Notification(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    title: str
    message: str
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
