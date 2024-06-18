"use client";
import React, { useRef } from 'react'
import { BiX } from 'react-icons/bi';
import { FcCheckmark, FcHighPriority } from 'react-icons/fc';

const DeleteExtractAlert = ({ response, setResponse, state, setState, setDontShowState, deleteExtract }: {
  state: {
    open: boolean; // defines if modal is open;
    extractId: string; // id of extract to be deleted;
  };
  response: string; // response from fetchDelete to show success or error;
  setResponse: React.Dispatch<React.SetStateAction<string>>; // set response to reset modal state if closed;

  setState: React.Dispatch<React.SetStateAction<{ // update state (open or close) of modal;
    open: boolean;
    extractId: string; // this id will never be changed in this component, dont care about it. He is here just to fullfil type rules;
  }>>;
  setDontShowState: (key: string) => void; // set the state of the dont show again configs;
  deleteExtract: any; // function that will delete the extract;
}) => {

  const modalRefInner = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [blockModalOption, setBlockModalOption] = React.useState<boolean>(false); // state of dont show again checkbox. If true, dont show again modal;


  // function that closes the modal if clicked outside of it;  
  modalRef.current?.addEventListener('click', (e: MouseEvent) => {
    if (modalRefInner.current) {
      if (window.innerWidth > 425) {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = modalRefInner.current;
        const right = offsetLeft + offsetWidth;
        const bottom = offsetTop + offsetHeight;

        if (e.clientX < offsetLeft || e.clientX > right || e.clientY < offsetTop || e.clientY > bottom) {
          setBlockModalOption(false);
          setState(prev => {
            return {
              ...prev,
              open: false
            }
          });
        }
      }
    }
  })

  return (
    <div ref={modalRef} className={`${state.open ? 'opacity-100 visible' : 'opacity-0 invisible'} 
      fixed top-0 left-0 flex items-center justify-center w-screen h-screen z-999999 bg-black/50 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 transition-all duration-300 ease-in-out`}>
      <div ref={modalRefInner} className='relative w-11/12 border shadow-2 border-stroke xsm:w-100 h-fit rounded-lg bg-white p-10 dark:bg-boxdark dark:border-strokedark'>
        {/* returns based on response */}
        {/* response neutral */}
        {response === '' && (
          <React.Fragment>
            <FcHighPriority className='mx-auto w-12 h-12 mb-4' />
            <h2 className='text-graydark font-medium text-xl text-center mb-4 dark:text-white'>
              Tem certeza que deseja excluir este registro? Esta ação não poderá ser desfeita.
            </h2>
            <div className='flex gap-4 justify-center py-4'>
              <button onClick={() => deleteExtract(state.extractId)} className='px-6 py-2 bg-blue-700 hover:bg-blue-500 transition-all duration-200 text-white rounded-md text-lg'>
                Sim, excluir!
              </button>
              <button onClick={() => {
                setState(prev => {
                  return {
                    ...prev,
                    open: false
                  }
                });
                setBlockModalOption(false);
              }} className='px-6 py-2 bg-meta-1 hover:bg-red transition-all duration-200 text-white rounded-md text-lg'>
                Cancelar
              </button>
            </div>
            <div className="p-2 mt-3">
              <label htmlFor="dont_show_again_delete_extract_confirm" className="flex gap-2 items-center justify-center">
                <input onChange={() => setBlockModalOption(!blockModalOption)} checked={blockModalOption} type="checkbox" id="dont_show_again_delete_extract_confirm" />
                <span className='text-sm'>Não mostrar novamente essa mensagem</span>
              </label>
            </div>
          </React.Fragment>
        )}
        {/* end of response neutral */}

        {/* response ok */}
        {response === 'ok' && (
          <React.Fragment>
            <FcCheckmark className='mx-auto w-12 h-12 mb-4' />
            <h2 className='text-graydark font-medium text-xl text-center mb-4 dark:text-white'>
              O extrato foi excluído com sucesso!
            </h2>
            <div className='flex gap-4 justify-center py-4'>
              <button onClick={() => {
                if (blockModalOption) {
                  setDontShowState('show_delete_extract_alert');
                }
                setState(prev => {
                  return {
                    ...prev,
                    open: false
                  }
                });
                setTimeout(() => setResponse(''), 1500);
              }} className='px-6 py-2 bg-blue-700 hover:bg-blue-500 transition-all duration-200 text-white rounded-md text-lg'>
                Ok
              </button>
            </div>
          </React.Fragment>
        )}
        {/* end of response ok */}

        {/* response error */}
        {response === 'error' && (
          <React.Fragment>
            <BiX className='mx-auto w-17 h-17 mb-4 fill-meta-1' />
            <h2 className='text-graydark font-medium text-xl text-center mb-4 dark:text-white'>
              Houve um erro ao tentar excluir o extrato.
            </h2>
            <div className='flex gap-4 justify-center py-4'>
              <button onClick={() => {
                if (blockModalOption) {
                  setDontShowState('show_delete_extract_alert');
                }
                setState(prev => {
                  return {
                    ...prev,
                    open: false
                  }
                });
                setTimeout(() => setResponse(''), 1500);
              }} className='px-6 py-2 bg-blue-700 hover:bg-blue-500 transition-all duration-200 text-white rounded-md text-lg'>
                Ok
              </button>
            </div>
          </React.Fragment>
        )}
        {/* end of response error */}
      </div>
    </div>
  )
}

export default DeleteExtractAlert
