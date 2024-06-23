'use client'
import UnloggedLayout from '@/components/Layouts/UnloggedLayout'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { BiCheck, BiChevronDown, BiRightArrowAlt } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';

const availablesPlans = [
    {
        type: 'normal',
        title: '1º grau',
        price: 'R$50',
        offer: {
            state: false,
            text: 'none'
        },
        features: [
            '50 créditos',
            '10 possíveis cálculos',
            'Suporte Básico'
        ]
    },
    {
        type: 'normal',
        title: 'Tribunal',
        price: 'R$197',
        offer: {
            state: true,
            text: '21% OFF'
        },
        features: [
            '100 créditos',
            '20 possíveis cálculos',
            'Suporte Padrão'
        ]
    },
    {
        type: 'normal',
        title: 'Superior',
        price: 'R$739',
        offer: {
            state: true,
            text: '26% OFF'
        },
        features: [
            '1000 créditos',
            '200 possíveis cálculos',
            'Suporte Prioritário'
        ]
    },
    {
        type: 'special',
        title: 'Supremo',
        price: 'R$1.600',
        offer: {
            state: true,
            text: '36% OFF'
        },
        features: [
            '2500 créditos',
            '500 possíveis cálculos',
            'Suporte Dedicado'
        ]
    }
]

const Pricing = () => {

    const [currentTextIndex, setCurrentTextIndex] = React.useState<number>(0);

    const texts: Array<string> = [
        'Segurança jurídica',
        'Confiança',
        'Melhor preço do Mercado',
        'Agilidade',
        'Negociação justa',
        'Transparência',
        'Flexibilidade',
        'Satisfação garantida',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentTextIndex === texts.length - 1) {
                setCurrentTextIndex(0);
            } else {
                setCurrentTextIndex((prevIndex) => prevIndex + 1);
            }
            console.log('s')
        }, 6000); // Muda de texto a cada 3 segundos

        return () => clearInterval(interval);
    });

    return (
        <UnloggedLayout>
            <header className="py-6 px-16 flex items-center justify-between lg:px-8">
                <Image
                    className="block"
                    src={"/images/logo/logo.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                />
                <nav className='flex items-center text-strokedark justify-center gap-12'>
                    <Link href="#">Home</Link>
                    <Link href="#" className='flex items-center gap-1'>
                        <span>Produtos</span>
                        <BiChevronDown />
                    </Link>
                    <Link href="#" className='flex items-center gap-1'>
                        <span>Recursos</span>
                        <BiChevronDown />
                    </Link>
                    <Link href="#">Sobre nós</Link>
                </nav>
                <div className='flex items-center gap-4'>
                    <Link href='/auth/signin/' className='px-6 py-3 border border-blue-700 rounded-md text-blue-700 hover:-translate-y-2 hover:bg-blue-800 hover:border-blue-800 hover:text-white transition-translate duration-300'>
                        <span>Entrar</span>
                    </Link>
                    <Link href='/auth/signup/' className='px-6 py-3 bg-blue-700 border border-blue-700 text-white rounded-md hover:-translate-y-2 hover:bg-blue-800 hover:border-blue-800 transition-all duration-300'>
                        <span>Cadastrar</span>
                    </Link>
                </div>
            </header>
            <div className='w-230 h-75 mx-auto flex flex-col gap-2 justify-center items-center bg-gray'>
                <h1 className='font-medium h-15 text-strokedark text-5xl'>
                    Ativos é
                </h1>
                <div className="relative w-[600px] h-15 flex overflow-hidden font-semibold text-center">
                    {texts.map((text, index) => (
                        <div
                            key={index}
                            className={`absolute w-full h-full text-5xl left-0 text-blue-500 transition-all duration-500 ${index === currentTextIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}
                        >
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='min-h-screen py-20 px-5'>
                <div className='flex gap-8'>
                    <div className='w-[500px] flex flex-col justify-center gap-8'>
                        <h2 className='font-bold text-6xl text-black'>
                            Venda seu precatório com segurança
                        </h2>
                        <p className='text-lg'>
                            Descubra como potencializar suas finanças antecipando seu precatório de forma segura e descomplicada. Maximize seu poder de compra e conquiste seus objetivos agora mesmo.
                        </p>
                        <Link href='#' className='py-3 px-6 max-w-fit flex gap-3 justify-center bg-blue-700 self-baseline text-white rounded-md hover:bg-blue-800 transition-all duration-300 group'>
                            <span>Fale conosco</span>
                            <BiRightArrowAlt className='w-6 h-6 group-hover:translate-x-1 transition-all duration-300' />
                        </Link>
                    </div>
                    <div className="flex-1">
                        <img
                            src={"/images/done_deal.jpg"}
                            alt='acordo'
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='hidden relative overflow-hidden lg:flex flex-col items-center -z-2 pt-40 w-full h-screen bg-[#000000]'>
                {/* =====> ellipses <===== */}
                <div className='rounded-full bg-[#0025ce] w-full h-150 absolute z-0 rotate-12 -bottom-2/3 -left-1/4 blur-3xl'></div>
                <div className='rounded-full bg-[#303e57] w-125 h-125 absolute z-0 top-[15%] -left-1/4 blur-3xl'></div>
                <div className='rounded-full rotate-[35deg] bg-[#4d949a] w-125 h-125 absolute z-0 -bottom-[45%] -left-39 blur-3xl'></div>
                <div className='rounded-full bg-[#4d3589] w-[990px] h-[900px] absolute z-0 -bottom-[90%] -right-1/4 blur-3xl'></div>
                <div className='rounded-full bg-[#badaff] w-203 h-150 absolute z-0 -bottom-[80%] -right-1/4 blur-3xl'></div>

                <h1 className='max-w-180 relative z-10 text-center text-white font-medium text-5xl'>
                    Pacotes com preços para equipes de todos os tamanhos
                </h1>

            </div>
            <div className='relative'>
                <div className='absolute left-0 -top-[230px] flex w-full justify-between z-10 px-6'>
                    {availablesPlans.map((plan, index) => (
                        <React.Fragment key={index}>
                            {plan.type === 'normal' ? (
                                <div className='bg-white rounded-md p-6 text-black flex flex-col gap-10 w-[300px] shadow-xl'>
                                    <h3 className='text-2xl font-bold'>{plan.title}</h3>
                                    <div className='flex items-center gap-5'>
                                        <p className='text-3xl font-bold'>{plan.price}<span className='text-sm'>,00</span></p>
                                        {plan.offer.state && <p className='text-meta-1 line-through italic'>{plan.offer.text}</p>}
                                    </div>
                                    <ul className='flex flex-col gap-4'>
                                        {plan.features.map((feature, index) => {
                                            return (
                                                <li key={index} className='flex items-center gap-4'>
                                                    <BiCheck className='w-6 h-6 text-meta-3' />
                                                    <span>{feature}</span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <button className='py-3 w-full flex gap-3 justify-center bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-all duration-300 group'>
                                        <span>Comprar pacote</span>
                                        <BiRightArrowAlt className='w-6 h-6 group-hover:translate-x-1 transition-all duration-300' />
                                    </button>
                                </div>
                            ) : (
                                <div className='relative rounded-b-md border-2 border-meta-1 bg-boxdark p-6 text-gray flex flex-col gap-10 w-[300px] shadow-xl '>
                                    <div className='absolute w-[300px] rounded-t-md -top-6 -left-[2px] border-2 border-meta-1 flex items-center justify-center gap-3 text-sm bg-meta-1'>
                                        <p>Melhor opção</p>
                                        <BsStars />
                                    </div>
                                    <h3 className='text-2xl font-bold'>{plan.title}</h3>
                                    <div className='flex items-center gap-5'>
                                        <p className='text-3xl font-bold'>{plan.price}<span className='text-sm'>,00</span></p>
                                        {plan.offer.state && <p className='text-red line-through italic'>{plan.offer.text}</p>}
                                    </div>
                                    <ul className='flex flex-col gap-4'>
                                        {plan.features.map((feature, index) => {
                                            return (
                                                <li key={index} className='flex items-center gap-4'>
                                                    <BiCheck className='w-6 h-6 text-meta-3' />
                                                    <span>{feature}</span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <button className='py-3 w-full flex gap-3 justify-center bg-red text-white rounded-md hover:bg-meta-1 transition-all duration-300 group'>
                                        <span>Comprar pacote</span>
                                        <BiRightArrowAlt className='w-6 h-6 group-hover:translate-x-1 transition-all duration-300' />
                                    </button>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <main className="pt-40 pb-36 px-8 bg-gray">

                <div className="max-w-md mx-auto mb-14 text-center">
                    <h1 className="text-4xl font-semibold mb-6 lg:text-5xl"><span className="text-indigo-600">Flexible</span> Plans</h1>
                    <p className="text-xl text-gray-500 font-medium">Choose a plan that works best for you and your team.</p>
                </div>

                <div className="flex flex-col justify-between items-center lg:flex-row lg:items-start">

                    <div className="w-full flex-1 mt-8 p-8 order-2 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-1 lg:rounded-r-none">
                        <div className="mb-7 pb-7 flex items-center border-b border-gray-300">
                            <img src="https://res.cloudinary.com/williamsondesign/abstract-1.jpg" alt="" className="rounded-3xl w-20 h-20" />
                            <div className="ml-5">
                                <span className="block text-2xl font-semibold">Basic</span>
                                <span><span className="font-medium text-gray-500 text-xl align-top">$&thinsp;</span><span className="text-3xl font-bold">10 </span></span><span className="text-gray-500 font-medium">/ user</span>
                            </div>
                        </div>
                        <ul className="mb-7 font-medium text-gray-500">
                            <li className="flex text-lg mb-2">
                                <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                                <span className="ml-3">Get started with <span className="text-black">messaging</span></span>
                            </li>
                            <li className="flex text-lg mb-2">
                                <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                                <span className="ml-3">Flexible <span className="text-black">team meetings</span></span>
                            </li>
                            <li className="flex text-lg">
                                <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                                <span className="ml-3"><span className="text-black">5 TB</span> cloud storage</span>
                            </li>
                        </ul>
                        <a href="#/" className="flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl">
                            Choose Plan
                            <img src="https://res.cloudinary.com/williamsondesign/arrow-right.svg" className="ml-2" />
                        </a>
                    </div>

                    <div className="w-full flex-1 p-8 order-1 shadow-2xl shadow-graydark rounded-3xl bg-graydark text-gray-400 sm:w-96 lg:w-full lg:order-2 lg:mt-0">
                        <div className="mb-8 pb-8 flex items-center border-b border-gray-600">
                            <img src="https://res.cloudinary.com/williamsondesign/abstract-2.jpg" alt="" className="rounded-3xl w-20 h-20" />
                            <div className="ml-5">
                                <span className="block text-3xl font-semibold text-white">Startup</span>
                                <span><span className="font-medium text-xl align-top">$&thinsp;</span><span className="text-3xl font-bold text-white">24 </span></span><span className="font-medium">/ user</span>
                            </div>
                        </div>
                        <ul className="mb-10 font-medium text-xl">
                            <li className="flex mb-6">
                                <img src="https://res.cloudinary.com/williamsondesign/check-white.svg" />
                                <span className="ml-3">All features in <span className="text-white">Basic</span></span>
                            </li>
                            <li className="flex mb-6">
                                <img src="https://res.cloudinary.com/williamsondesign/check-white.svg" />
                                <span className="ml-3">Flexible <span className="text-white">call scheduling</span></span>
                            </li>
                            <li className="flex">
                                <img src="https://res.cloudinary.com/williamsondesign/check-white.svg" />
                                <span className="ml-3"><span className="text-white">15 TB</span> cloud storage</span>
                            </li>
                        </ul>
                        <a href="#/" className="flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl">
                            Choose Plan
                            <img src="https://res.cloudinary.com/williamsondesign/arrow-right.svg" className="ml-2" />
                        </a>
                    </div>

                    <div className="w-full flex-1 mt-8 p-8 order-3 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-3 lg:rounded-l-none">
                        <div className="mb-7 pb-7 flex items-center border-b border-gray-300">
                            <img src="https://res.cloudinary.com/williamsondesign/abstract-3.jpg" alt="" className="rounded-3xl w-20 h-20" />
                            <div className="ml-5">
                                <span className="block text-2xl font-semibold">Enterprise</span>
                                <span><span className="font-medium text-gray-500 text-xl align-top">$&thinsp;</span><span className="text-3xl font-bold">35 </span></span><span className="text-gray-500 font-medium">/ user</span>
                            </div>
                        </div>
                        <ul className="mb-7 font-medium text-gray-500">
                            <li className="flex text-lg mb-2">
                                <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                                <span className="ml-3">All features in <span className="text-black">Startup</span></span>
                            </li>
                            <li className="flex text-lg mb-2">
                                <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                                <span className="ml-3">Growth <span className="text-black">oriented</span></span>
                            </li>
                            <li className="flex text-lg">
                                <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                                <span className="ml-3"><span className="text-black">Unlimited</span> cloud storage</span>
                            </li>
                        </ul>
                        <a href="#/" className="flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl">
                            Choose Plan
                            <img src="https://res.cloudinary.com/williamsondesign/arrow-right.svg" className="ml-2" />
                        </a>
                    </div>

                </div>

            </main>
        </UnloggedLayout>
    )
}

export default Pricing;
