import ColorsActionsMenu from "./ColorActionsMenu";
import { withContextMenu } from "./withContextMenu";
import TemplateActionsMenu from "@/Builder/ContextMenu/TemplateActionsMenu";

export const TemplateContextMenu = withContextMenu(TemplateActionsMenu);
export const ColorsContextMenu = withContextMenu(ColorsActionsMenu);
