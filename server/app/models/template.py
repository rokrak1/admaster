from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime

class CustomerTemplate(BaseModel):
    customer_id: Optional[UUID4] = None
    name: Optional[str] = None
    template: Optional[List[Dict[str, Any]]] = None
    thumbnail: Optional[str] = None
    group: Optional[str] = None
    parent_group: Optional[str] = None

class CustomerTemplateDelete(BaseModel):
    id: UUID4 

class CustomerTemplateResponse(BaseModel):
    id: UUID4 
    created_at: datetime