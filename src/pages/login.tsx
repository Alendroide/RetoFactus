import DefaultLayout from "@/layouts/default";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginType, loginSchema } from "@/types/login";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import apiClient, { setAuthToken } from "@/axios/apiClient";
import { addToast } from "@heroui/toast";
import { useEffect } from "react";
import { Card, CardBody } from "@heroui/card";

export default function Login(){

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            window.location.href = '/facturas'
        }
    })

    const { reset, register, handleSubmit, formState : { errors } } = useForm({resolver : zodResolver(loginSchema)});

    async function onSubmit(data : loginType) {
        const body = {
            grant_type : "password",
            client_id : "9e6eee9d-e9d7-41e5-89bf-826868ca9e50",
            client_secret : "TdQDqbLQlmX7ndfux6vpzxaaI2EurQLlInoBFTtQ",
            username : data.username,
            password : data.password
        };
        try{
            addToast({
                title: "Iniciando sesión",
                description : "Espera un momento por favor...",
                color : "primary",
                promise: new Promise((resolve) => setTimeout(resolve, 3000)),
                classNames : {
                    base : "dark"
                }
            })
            const response = await apiClient.post("/oauth/token", body);

            addToast({
                title: "Inicio de sesión exitoso",
                description: "Dirigiendote a facturas",
                color: "success",
                classNames : {
                    base : "dark"
                },
            })
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            setAuthToken(token);

            await new Promise((resolve) => {
                setTimeout(() => {
                    console.log("Redirecting now...");
                    resolve(1);
                }, 1500);
            });
            
            window.location.href = "/facturas";
        }
        catch(error){
            addToast({
                title: "Error iniciando sesión",
                description: "Usuario o contraseña incorrectos",
                color: "danger",
                classNames : {
                    base : "dark"
                },
            })
            reset();
            return
        }
    }

    return(
        <DefaultLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 mx-auto">
                <Card className="bg-gray-900">
                    <CardBody className="flex flex-col text-center p-6 space-y-4">
                        <h1 className="text-2xl font-semibold text-gray-200">Iniciar sesión</h1>
                        <div className="mb-4 w-10/12 mx-auto">
                            <Input
                                {...register("username")}
                                label="Email"
                                isRequired
                                autoComplete="off"
                            />
                            <p>
                                {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                            </p>
                        </div>

                        <div className="mb-4 w-10/12 mx-auto">
                            <Input
                                {...register("password")}
                                label="Password"
                                type="password"
                                isRequired
                                autoComplete="off"
                            />
                            <p>
                                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                            </p>
                        </div>
                        <div>
                            <Button color="primary" variant="bordered" type="submit">Log in</Button>
                        </div>
                    </CardBody>
                </Card>
            </form>
        </DefaultLayout>
    )
}