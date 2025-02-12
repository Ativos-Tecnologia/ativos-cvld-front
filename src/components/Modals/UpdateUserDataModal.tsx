import api from '@/utils/api';
import UseMySwal from '@/hooks/useMySwal';
import InputMask from 'react-input-mask';
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
import { AxiosResponse } from 'axios';

interface UpdateUserData {
    email: string;
    phone: string;
}

export function UpdateUserDataModal() {
    const { data: user, updateProfile, setFirstLogin } = useContext(UserInfoAPIContext);
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<UpdateUserData>({
        defaultValues: {
            email: user.email || '',
            phone: user.phone || '',
        },
    });
    const swal = UseMySwal();

    const handleUpdateEmail = async (email: string) => {
        try {
            const request = await api.put(
                `api/reset-emai
                  l/`,
                {
                    email,
                },
            );
            if (request.status === 200) {
                swal.fire({
                    title: 'Email enviado, verifique na sua caixa de entrada para ativação do e-mail no sistema',
                    icon: 'success',
                });
                return request;
            }
        } catch (error: any) {
            swal.fire({
                title: `Erro ao Alterar Email: ${error.response.data.error}`,
                icon: 'error',
            });
        }
    };

    async function handleUpdateProfile(data: UpdateUserData) {
        if (Object.keys(errors).length > 0) return;

        if (data.email !== user.email) {
            try {
                const response = await api.get(`api/user/check-availability/${data.email}/`);

                if (response.data.available === false) {
                    swal.fire({
                        title: `O Email: ${data.email} já está em uso. Insira outro email.`,
                        icon: 'warning',
                    });

                    return;
                }
                handleUpdateEmail(data.email);
            } catch (err) {
                console.error(err);
            }
        }

        try {
            const response: AxiosResponse = await updateProfile(`${user.id}`, {
                phone: data.phone,
            });

            console.log(response.status);

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
                    <DialogTitle>Edite suas informações de usuário</DialogTitle>
                    <DialogDescription>
                        Faça as alterações para manter seu perfil atualizado.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleUpdateProfile)} className="grid gap-4 py-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            className="col-span-3"
                            {...register('email', {
                                required: 'Insira um email válido.',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Formato de email inválido.',
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="phone">Telefone</Label>
                        <InputMask
                            id="phone"
                            mask="(99) 99999-9999"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('phone', {
                                required: 'Insira um telefone válido.',
                            })}
                        />
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
