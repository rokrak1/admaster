import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { modalsAction } from "@/redux/modals";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "@/redux/store";
import { deleteTemplate, updateTemplate } from "@/api/template";
import { useContextMenu } from "@/Builder/hook/useContextMenu";
import { dataActions } from "@/redux/data";
import { toast } from "react-toastify";

export default function TemplateDeleteModal() {
  const [open] = useState(true);
  const dispatch = useDispatch();
  const { selectedTemplate } = useSelector((state: StoreState) => ({
    selectedTemplate: state.modals.modalData?.selectedTemplate,
  }));
  const closeModal = () => {
    dispatch(modalsAction.clearModal());
  };

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let [res, err] = await deleteTemplate(selectedTemplate.sequance);

    if (err) {
      toast.error("Error renaming template");
      closeModal();
      return;
    }
    console.log("red:", res);
    dispatch(dataActions.removeTemplate(res));
    closeModal();
  };

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div> */}
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h2"
                      className="text-xl font-semibold leading-6 text-gray-900"
                    >
                      Are you sure you want to delete {selectedTemplate.name}?
                    </Dialog.Title>
                  </div>
                </div>
                <form onSubmit={handleConfirm}>
                  <div className=" sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="duration-300 inline-flex mt-3 w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={closeModal}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
