"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import api from "@/utils/api";
import {
  useForm,
  SubmitHandler,
} from 'react-hook-form';
import UseMySwal from "@/hooks/useMySwal";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { BiCamera, BiLogoFacebook, BiLogoLinkedin, BiLogoTwitter, BiEditAlt } from "react-icons/bi";
import { BsXLg } from "react-icons/bs";


const Profile = () => {

  const { data, loading, error, updateProfile, firstLogin, setFirstLogin } = useContext(UserInfoAPIContext);
  const auxData = data;
  const [editMode, setEditMode] = useState(false);
  const [editProfilePicture, setEditProfilePicture] = useState(false);

  const [imageUrl, setImageUrl] = useState("/images/logo/512x512.png");

  useEffect(() => {
    if (firstLogin) {
      setEditMode(true);
      UseMySwal().fire({
        title: "Bem-vindo ao CVLD Simulator",
        text: "Por favor, preencha o formulário de perfil para utilizar a plataforma",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  });

  useEffect(() => {
    setImageUrl(data[0]?.profile_picture || "/images/logo/512x512.png");
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImageUrl(reader.result!.toString());
        setEditProfilePicture(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<Record<string, any>> = async (data) => {
    const formData = new FormData();

    if (editProfilePicture) {
      formData.append("profile_picture", data.profile_picture[0]);
      setEditProfilePicture(false);
    } else {
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("title", data.title);
      setEditMode(false);
    }

    try {

      const response = await updateProfile(`${auxData[0].id}`, formData);

      if (response.status === 200) {
        setFirstLogin(false);
        const firstUserResponse = await api.patch(`api/user/update-first-login/${auxData[0].id}/`);
        if (firstUserResponse.status !== 200) {
          UseMySwal().fire({
            title: "Um erro inesperado ocorreu",
            icon: "error",
            timer: 3000,
            timerProgressBar: true,
          });
        }
        UseMySwal().fire({
          title: "Perfil atualizado",
          icon: "success",
        });
      } else {
        UseMySwal().fire({
          title: "Profile not updated",
          icon: "error",
        });
      }


    } catch (error) {
      console.error(error);

    }
  }


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Perfil" />

        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-35 md:h-65">
            <Image
              src={"/images/cover/cover-01.png"}
              alt="profile cover"
              className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              width={970}
              height={260}
              style={{
                width: "auto",
                height: "100%",
              }}
            // placeholder={"blur"}

            />
            <div className="absolute -bottom-3.5 right-2 z-10">
              <label
                htmlFor="cover"
                className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-90"
              >
                <input
                  type="file"
                  name="cover"
                  id="cover"
                  className="sr-only"
                />
                {editMode ? (
                  <React.Fragment>
                    <span>
                      <BsXLg />
                    </span>
                    <button onClick={
                      () => setEditMode(!editMode)
                    }>Cancelar Edição</button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span>
                      <BiEditAlt />
                    </span>
                    <button onClick={
                      () => setEditMode(!editMode)
                    }>Editar Perfil</button>
                  </React.Fragment>
                )}

              </label>
            </div>
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2">
                <Image
                  src={imageUrl}
                  width={160}
                  height={160}
                  className="rounded-full sm:max-w-42 sm:max-h-42 max-h-38 max-h-44 object-cover object-center aspect-square"
                  alt="profile"
                />

                {/* only visible when editing profile */}
                {editMode && (
                  <label
                    htmlFor="profile"
                    className="absolute bottom-0 right-0 flex h-8.5 w-11.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >

                    <BiCamera />

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        type="file"
                        accept="image/*"
                        id="profile"
                        className="sr-only"
                        {
                        ...register("profile_picture")
                        }
                        onChange={(e) => {
                          handleImageChange(e);
                        }}
                      />
                      {
                        editProfilePicture && (
                          <button type="submit">
                            <span>✔️</span>
                          </button>
                        )
                      }
                    </form>
                  </label>
                )}
                {/* end only visible when editing profile */}

              </div>
            </div>
            <div className="mt-4">
              {
                !editMode ? (
                  <><h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                    {loading ? "Loading..." : `${data[0]?.first_name} ${data[0]?.last_name}`}
                  </h3><p className="font-medium">{loading ? "Loading..." : data[0]?.title}</p></>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="border border-stroke p-2 rounded-md dark:border-strokedark"
                        {
                        ...register("first_name")
                        }
                        defaultValue={data[0]?.first_name}
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="border border-stroke p-2 rounded-md dark:border-strokedark"
                        {
                        ...register("last_name")
                        }
                        defaultValue={data[0]?.last_name}
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        className="border border-stroke p-2 rounded-md dark:border-strokedark"
                        {
                        ...register("title")
                        }
                        defaultValue={data[0]?.title}
                      />
                      <button type="submit" className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80">Salvar</button>
                    </div>
                  </form>
                )


              }
              <div className="mx-auto mb-5.5 mt-4.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    259
                  </span>
                  <span className="text-sm">Posts</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    129K
                  </span>
                  <span className="text-sm">Followers</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    2K
                  </span>
                  <span className="text-sm">Following</span>
                </div>
              </div>

              <div className="mx-auto max-w-180">
                <h4 className="font-semibold text-black dark:text-white">
                  About Me
                </h4>
                <p className="mt-4.5">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque posuere fermentum urna, eu condimentum mauris
                  tempus ut. Donec fermentum blandit aliquet. Etiam dictum
                  dapibus ultricies. Sed vel aliquet libero. Nunc a augue
                  fermentum, pharetra ligula sed, aliquam lacus.
                </p>
              </div>

              <div className="mt-6.5">
                <h4 className="mb-3.5 font-medium text-black dark:text-white">
                  Follow me on
                </h4>
                <div className="flex items-center justify-center gap-3.5">
                  <Link
                    href="#"
                    className="hover:text-primary"
                    aria-label="social-icon"
                  >
                    <BiLogoFacebook style={{ width: '22px', height: '22px', color: 'inherit' }} />

                  </Link>
                  <Link
                    href="#"
                    className="hover:text-primary"
                    aria-label="social-icon"
                  >
                    <BiLogoTwitter style={{ width: '22px', height: '22px', color: 'inherit' }} />

                  </Link>
                  <Link
                    href="#"
                    className="hover:text-primary"
                    aria-label="social-icon"
                  >

                    <BiLogoLinkedin style={{ width: '22px', height: '22px', color: 'inherit' }} />

                  </Link>
                  <Link
                    href="#"
                    className="hover:text-primary"
                    aria-label="social-icon"
                  >
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_30_978)">
                        <path
                          d="M18.3233 10.6077C18.2481 9.1648 17.7463 7.77668 16.8814 6.61929C16.6178 6.90312 16.3361 7.16951 16.038 7.41679C15.1222 8.17748 14.0988 8.79838 13.0011 9.25929C13.1542 9.58013 13.2945 9.89088 13.4182 10.1842V10.187C13.4531 10.2689 13.4867 10.3514 13.519 10.4345C14.9069 10.2786 16.3699 10.3355 17.788 10.527C17.9768 10.5527 18.1546 10.5802 18.3233 10.6077ZM9.72038 3.77854C10.6137 5.03728 11.4375 6.34396 12.188 7.69271C13.3091 7.25088 14.2359 6.69354 14.982 6.07296C15.2411 5.8595 15.4849 5.62824 15.7117 5.38088C14.3926 4.27145 12.7237 3.66426 11 3.66671C10.5711 3.66641 10.1429 3.70353 9.72038 3.77762V3.77854ZM3.89862 9.16396C4.52308 9.1482 5.1468 9.11059 5.76863 9.05121C7.27163 8.91677 8.7618 8.66484 10.2255 8.29771C9.46051 6.96874 8.63463 5.67578 7.75046 4.42296C6.80603 4.89082 5.97328 5.55633 5.30868 6.37435C4.64409 7.19236 4.16319 8.14374 3.89862 9.16396ZM5.30113 15.6155C5.65679 15.0957 6.12429 14.5109 6.74488 13.8747C8.07771 12.5089 9.65071 11.4455 11.4712 10.8589L11.528 10.8424C11.3768 10.5087 11.2347 10.2108 11.0917 9.93029C9.40871 10.4207 7.63588 10.7269 5.86946 10.8855C5.00779 10.9634 4.23504 10.9973 3.66671 11.0028C3.66509 12.6827 4.24264 14.3117 5.30204 15.6155H5.30113ZM13.7546 17.7971C13.4011 16.0144 12.9008 14.2641 12.2586 12.5639C10.4235 13.2303 8.96138 14.2047 7.83113 15.367C7.375 15.8276 6.97021 16.3362 6.62388 16.8841C7.88778 17.8272 9.42308 18.3356 11 18.3334C11.9441 18.3347 12.8795 18.1533 13.7546 17.799V17.7971ZM15.4715 16.8117C16.9027 15.7115 17.8777 14.1219 18.2096 12.3475C17.898 12.2696 17.5029 12.1917 17.0684 12.1312C16.1023 11.9921 15.1221 11.9819 14.1534 12.101C14.6988 13.6399 15.1392 15.2141 15.4715 16.8126V16.8117ZM11 20.1667C5.93729 20.1667 1.83337 16.0628 1.83337 11C1.83337 5.93729 5.93729 1.83337 11 1.83337C16.0628 1.83337 20.1667 5.93729 20.1667 11C20.1667 16.0628 16.0628 20.1667 11 20.1667Z"
                          fill=""
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_30_978">
                          <rect width="22" height="22" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-primary"
                    aria-label="social-icon"
                  >
                    <svg
                      className="fill-current"
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_30_982)">
                        <path
                          d="M11.6662 1.83337C6.6016 1.83337 2.49951 5.93546 2.49951 11C2.49847 12.9244 3.10343 14.8002 4.22854 16.3613C5.35366 17.9225 6.94181 19.0897 8.76768 19.6974C9.22602 19.7771 9.39743 19.5021 9.39743 19.261C9.39743 19.0438 9.38552 18.3224 9.38552 17.5542C7.08285 17.9786 6.48701 16.9932 6.30368 16.4771C6.2001 16.2131 5.75368 15.4 5.3641 15.1819C5.04326 15.0105 4.58493 14.586 5.35218 14.575C6.07451 14.5631 6.58968 15.2396 6.76201 15.5146C7.58701 16.9006 8.90518 16.511 9.43135 16.2709C9.51202 15.675 9.75218 15.2745 10.0162 15.0453C7.9766 14.8161 5.84535 14.025 5.84535 10.5188C5.84535 9.52146 6.2001 8.69737 6.78493 8.05479C6.69326 7.82562 6.37243 6.88604 6.8766 5.62562C6.8766 5.62562 7.64385 5.38546 9.39743 6.56612C10.1437 6.35901 10.9147 6.25477 11.6891 6.25629C12.4683 6.25629 13.2474 6.35896 13.9808 6.56521C15.7334 5.37354 16.5016 5.62654 16.5016 5.62654C17.0058 6.88696 16.6849 7.82654 16.5933 8.05571C17.1772 8.69737 17.5329 9.51046 17.5329 10.5188C17.5329 14.037 15.3906 14.8161 13.351 15.0453C13.6829 15.3313 13.9698 15.8813 13.9698 16.7411C13.9698 17.9667 13.9579 18.9521 13.9579 19.262C13.9579 19.5021 14.1302 19.7881 14.5885 19.6965C16.4081 19.0821 17.9893 17.9126 19.1094 16.3526C20.2296 14.7926 20.8323 12.9206 20.8329 11C20.8329 5.93546 16.7308 1.83337 11.6662 1.83337Z"
                          fill=""
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_30_982">
                          <rect
                            width="22"
                            height="22"
                            fill="white"
                            transform="translate(0.666138)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
