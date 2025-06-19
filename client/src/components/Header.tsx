import { useEffect, useState } from "react";
import { useProfile } from "./hooks/useProfile.hook"
import { LoginButton, MyAccountButton, RegisterButton } from "./buttons.list";


export default function Header() {
    const [loggedin, setLoggedin] = useState(false)
    const { data: profile } = useProfile();

    useEffect(() => {
        setLoggedin(!!profile);
    }, [profile]);
    console.log(profile)

    return (
        <div className="w-full py-4 flex justify-center items-center border-b border-purple-600">
            <div className="w-[80%] flex justify-between items-center">
                <h2 className="font-semibold text-2xl">Redirect Checker Web</h2>
                <div className="flex items-center justify-between gap-4">
                    {loggedin ? <MyAccountButton /> : (
                        <>
                            <LoginButton />
                            <RegisterButton />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}