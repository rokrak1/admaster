from fastapi import HTTPException
from app.supabase_client import supabase
from app.enums.response_codes import Response_codes


async def update_customer_template(user_id, update_data):
    try:
        updated_template = supabase.table("customer_templates").update(update_data).eq("id", update_data["id"]).execute()
        if not updated_template.data:
            raise ValueError("Template not found.")
        return updated_template.data
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail="Template update failed",
            )

async def create_customer_template(user_id, data):
    try:
        created_template = supabase.table("customer_templates").insert({
            "customer_id": user_id,
            "name": data["name"],
            "template": data["template"],
            "thumbnail": data["thumbnail"],
            "group": data["group"],
            "parent_group": data["parent_group"]
        }).execute()
        print("created_template",created_template)
        return created_template.data
    except Exception as e:
        print("error:",e)
        raise HTTPException(
            status_code=400,
            detail="Template creation failed",
            )

async def get_customer_template(user_id,  id):
    try:
        template = supabase.table("customer_templates").select("*").eq("id", id).single().execute()
        if not template.data:
            raise ValueError("Template not found.")
        return template.data
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail="Template retrieval failed",
            )

async def get_customer_templates(user_id):
    try:
        templates = supabase.table("customer_templates").select("*").eq("customer_id", user_id).execute()
        print("templates",templates)
        return templates.data
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail="Templates retrieval failed",
            )