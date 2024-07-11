import { Avatar, Badge, Button, Datepicker, Drawer, Label, Textarea, TextInput, theme } from "flowbite-react";
import { Suspense, useState } from "react";
import { BiTask } from "react-icons/bi";
import { HiCalendar, HiUserAdd } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import Loader from "../common/Loader";

export function TaskDrawer({ open, setOpen }: { open: boolean, setOpen: any }) {

  const handleClose = () => setOpen(false);

  return (
    <>
      {/* <div className="flex min-h-[50vh] items-center justify-center">
        <Button onClick={}>Show drawer</Button>
      </div> */}


      <Drawer open={open} onClose={handleClose}>
        <Drawer.Header title="NOVA TAREFA" titleIcon={BiTask} />
        <Drawer.Items>
          <form action="#">
            <div className="mb-6 mt-3">
              <Label htmlFor="title" className="mb-2 block">
                Título
              </Label>
              <TextInput id="title" name="title" placeholder="Apple Keynote" />
            </div>
            <div className="mb-6">
              <Label htmlFor="description" className="mb-2 block">
                Descrição
              </Label>
              <Textarea id="description" name="description" placeholder="Write event description..." rows={4} />
            </div>
            <div className="mb-6">
              <Datepicker />
            </div>
            <div className="mb-6">
              <TextInput
                id="guests"
                name="guests"
                placeholder="Enviar convite para..."
                type="search"
                rightIcon={() => (
                  <Button size="sm" className="[&>span]:items-center [&>span]:px-2 [&>span]:py-0">
                    <HiUserAdd className="mr-2" />
                    Add
                  </Button>
                )}
                theme={{
                  field: {
                    rightIcon: {
                      base: twMerge(theme.textInput.field.rightIcon.base, "pointer-events-auto"),
                    },
                  },
                }}
              />
            </div>
            <Avatar.Group className="mb-6">
              <Avatar alt="" img="/images/people/profile-picture-5.jpg" rounded size="sm" stacked />
              <Avatar alt="" img="/images/people/profile-picture-2.jpg" rounded size="sm" stacked />
              <Avatar alt="" img="/images/people/profile-picture-3.jpg" rounded size="sm" stacked />
              <Avatar alt="" img="/images/people/profile-picture-4.jpg" rounded size="sm" stacked />
            </Avatar.Group>
            <Button className="w-full">
              <HiCalendar className="mr-2" />
              Criar Tarefa
            </Button>
          </form>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
