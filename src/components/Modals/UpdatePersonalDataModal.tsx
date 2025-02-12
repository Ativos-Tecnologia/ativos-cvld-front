import UseMySwal from '@/hooks/useMySwal';
import { Pencil } from 'lucide-react';
import { Button } from '../Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { Textarea } from '../ui/textarea';

interface UpdateProfileData {
    first_name: string;
    last_name: string;
    title: string;
    bio: string;
}

export function UpdatePersonalDataModal() {
    const { data: user, updateProfile, setFirstLogin } = useContext(UserInfoAPIContext);
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<UpdateProfileData>({
        defaultValues: {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            title: user.title || '',
            bio: user.bio || '',
        },
    });
    const swal = UseMySwal();

    async function handleUpdateProfile(data: UpdateProfileData) {
        if (Object.keys(errors).length > 0) return;

        try {
            const response = await updateProfile(`${user.id}`, data);

            if (response.status === 200) {
                setFirstLogin(false);
                swal.fire({
                    title: 'Perfil atualizado',
                    icon: 'success',
                });
            } else {
                swal.fire({
                    title: 'Perfil não atualizado. Verifique os campos e tente novamente',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-6 w-full rounded-full p-3 text-sm font-medium md:mt-0 md:size-fit">
                    <Pencil size={18} /> Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] sm:max-w-[425px]">
                <DialogHeader className="text-left">
                    <DialogTitle>Edite suas informações pessoais</DialogTitle>
                    <DialogDescription>
                        Faça as alterações para manter seu perfil atualizado.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleUpdateProfile)} className="grid gap-4 py-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="first-name">Primeiro Nome</Label>
                        <Input
                            id="first-name"
                            className="col-span-3"
                            {...register('first_name', {
                                required: 'Insira um nome válido.',
                            })}
                        />
                        {errors.first_name && (
                            <p className="text-xs text-red-500">{errors.first_name.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="last_name">Sobrenome</Label>
                        <Input
                            id="last_name"
                            className="col-span-3"
                            {...register('last_name', {
                                required: 'Insira um sobrenome válido.',
                            })}
                        />
                        {errors.last_name && (
                            <p className="text-xs text-red-500">{errors.last_name.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" className="col-span-3" {...register('title')} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" className="col-span-3" {...register('bio')} />
                    </div>
                    <DialogFooter>
                        <Button disabled={isSubmitting} type="submit">
                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
