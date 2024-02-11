from typing import Optional, List
from pydantic import BaseModel

class Frame(BaseModel):
    brightness: int
    fill: str
    height: float
    id: str
    name: str
    opacity: float
    scaleX: float
    scaleY: float
    width: float
    x: float
    y: float

class Text(BaseModel):
    fill: str
    fontFamily: Optional[str] = None
    color: str
    height: float
    opacity: float
    rotation: float
    scaleX: Optional[float] = None
    scaleY: Optional[float] = None
    stroke: Optional[str] = None
    strokeWidth: Optional[float] = None
    text: str
    width: float
    x: float
    y: float
    varId: Optional[str] = None
    zIndex: Optional[int] = None
    type: str

class Image(BaseModel):
    fill: str
    height: float
    image: str  # Assuming this is a base64 encoded string of the image
    opacity: float
    rotation: float
    scaleX: float
    scaleY: float
    stroke: Optional[str] = None
    strokeWidth: Optional[float] = None
    width: float
    x: float
    y: float
    varId: Optional[str] = None
    zIndex: Optional[int] = None
    type: str

class CanvasData(BaseModel):
    frame: Frame
    text: List[Text]
    image: List[Image]