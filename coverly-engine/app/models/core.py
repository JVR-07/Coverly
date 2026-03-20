from sqlalchemy import Column, String, Boolean, JSON, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.db import Base
import uuid

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    type = Column(String, nullable=False)
    description = Column(String)
    price_base = Column(Numeric(12, 2))
    is_active = Column(Boolean, default=True)
    specific_data = Column(JSON)
    
    coverages = relationship("Coverage", back_populates="product")

class Coverage(Base):
    __tablename__ = "coverages"

    id = Column(String, primary_key=True)
    product_id = Column(String, ForeignKey("products.id"))
    name = Column(String)
    description = Column(String)
    value = Column(Numeric(12, 2))

    product = relationship("Product", back_populates="coverages")

class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(String)
    discount_percent = Column(Numeric(5, 2))
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime)
