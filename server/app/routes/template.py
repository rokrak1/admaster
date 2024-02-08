from fastapi import HTTPException, Depends, Request, APIRouter, Response, Path
from typing import Optional
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import ORJSONResponse
from typing import List

from app.routers import protected_router
from app.models.template import CustomerTemplate, CustomerTemplateResponse
from app.functions.template import delete_customer_template, update_customer_template, create_customer_template, get_customer_template, get_customer_templates


@protected_router.put("/templates/{templateId}", response_model=CustomerTemplateResponse)
async def update_customer_template_endpoint(update_data: CustomerTemplate, request: Request, templateId: str):
    user_id = request.state.customer_id
    print(templateId)
    # Assuming you have a function to update customer templates in your database
    updated_template = await update_customer_template(user_id, templateId, update_data.dict(exclude_unset=True))
    if not updated_template:
        raise HTTPException(status_code=404, detail="Customer template not found")
    response = ORJSONResponse(content={"template": updated_template, "message": "Template updated successfully"})
    return response

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
    template = await get_customer_template(user_id, id)
    if not template:
        raise HTTPException(status_code=404, detail="Customer template not found")
    return template

@protected_router.delete("/templates/{templateId}", response_model=CustomerTemplateResponse)
async def delete_customer_template_endpoint(templateId: str, request: Request):
    user_id = request.state.customer_id
    # Assuming you have a function to delete customer templates from your database
    deleted_template = await delete_customer_template(user_id, templateId)
    if not deleted_template:
        raise HTTPException(status_code=404, detail="Customer template not found")
    response = ORJSONResponse(content={"template": deleted_template, "message": "Template deleted successfully"})
    return response

@protected_router.get("/templates", response_model=List[CustomerTemplateResponse])
async def get_customer_templates_endpoint(request: Request):
    user_id = request.state.customer_id

    templates = await get_customer_templates(user_id)
    response = ORJSONResponse(content={"templates": templates, "message": "Template created successfully"})
    return response