from fastapi import HTTPException, Depends, Request, APIRouter, Response
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import ORJSONResponse
from typing import List

from app.routers import protected_router
from app.models.template import CustomerTemplate, CustomerTemplateUpdate, CustomerTemplateResponse
from app.functions.template import update_customer_template, create_customer_template, get_customer_template, get_customer_templates


@protected_router.put("/templates/{id}", response_model=CustomerTemplateResponse)
async def update_customer_template_endpoint(update_data: CustomerTemplateUpdate, request: Request):
    user_id = request.state.customer_id
    # Assuming you have a function to update customer templates in your database
    updated_template = update_customer_template(user_id, update_data.id, update_data.dict(exclude_unset=True))
    if not updated_template:
        raise HTTPException(status_code=404, detail="Customer template not found")
    return updated_template

@protected_router.post("/templates", response_model=CustomerTemplateResponse)
async def create_customer_template_endpoint(template: CustomerTemplate, request: Request, response: Response):
    user_id = request.state.customer_id
    print(user_id)
    # Assuming you have a function to create customer templates in your database
    created_template = await create_customer_template(user_id, template.dict(exclude_unset=False))

    response = ORJSONResponse(content={"template": created_template, "message": "Template created successfully"})
    return response

@protected_router.get("/templates/{id}", response_model=CustomerTemplateResponse)
async def get_customer_template_endpoint(id: str, request: Request):
    user_id = request.state.customer_id
    # Assuming you have a function to get customer templates from your database
    template = get_customer_template(user_id, id)
    if not template:
        raise HTTPException(status_code=404, detail="Customer template not found")
    return template

@protected_router.get("/templates", response_model=List[CustomerTemplateResponse])
async def get_customer_templates_endpoint(request: Request):
    user_id = request.state.customer_id

    templates = await get_customer_templates(user_id)
    response = ORJSONResponse(content={"templates": templates, "message": "Template created successfully"})
    return response