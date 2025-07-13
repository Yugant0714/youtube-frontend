import React from "react";
import { Logo, Button, Input } from "./index";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createAccount, userLogin } from "../store/Slices/authSlice.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginSkeleton from "../skeleton/loginSkeleton.jsx";
import GetImagePreview from "./GetImagePreview.jsx";

function SignUp() {
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        watch,
    } = useForm();
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth?.loading);
    
    // Watch avatar field for validation
    const avatarField = watch("avatar");

    const submit = async (data) => {
        console.log("Form data:", data);
        
        // Validate avatar before submission
        if (!data.avatar || data.avatar.length === 0) {
            toast.error("Please select an avatar image");
            return;
        }

        try {
            const response = await dispatch(createAccount(data));
            console.log("Create account response:", response);
            
            if (response?.payload?.success) {
                const username = data?.username;
                const password = data?.password;
                
                // Auto-login after successful registration
                const loginResult = await dispatch(
                    userLogin({ username, password })
                );
                console.log("Login result:", loginResult);

                if (loginResult?.type === "login/fulfilled") {
                    navigate("/terms&conditions");
                } else {
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    if (loading) {
        return <LoginSkeleton />;
    }

    return (
        <div className="w-full h-screen text-white p-3 flex justify-center items-start sm:mt-8">
            <div className="flex flex-col space-y-2 justify-center items-center border border-slate-600 p-3">
                <div className="flex items-center gap-2">
                    <Logo />
                </div>
                <form
                    onSubmit={handleSubmit(submit)}
                    className="space-y-4 p-2 text-sm sm:w-96 w-full"
                >
                    <div className="w-full relative h-28 bg-[#222222]">
                        <div className="w-full h-full">
                            <GetImagePreview
                                name="coverImage"
                                control={control}
                                className="w-full h-28 object-cover border-none border-slate-900"
                                cameraIcon
                            />
                            <div className="text-sm absolute right-2 bottom-2 hover:text-purple-500 cursor-default">
                                Cover Image (Optional)
                            </div>
                        </div>
                        <div className="absolute left-2 bottom-2 rounded-full border-2">
                            <GetImagePreview
                                name="avatar"
                                control={control}
                                className="object-cover rounded-full h-20 w-20 outline-none"
                                cameraIcon={true}
                                cameraSize={20}
                                rules={{ required: "Avatar is required" }}
                            />
                        </div>
                    </div>
                    
                    {/* Avatar validation error */}
                    {errors.avatar && (
                        <div className="text-red-500 text-sm">
                            {errors.avatar.message}
                        </div>
                    )}
                    
                    {/* Avatar selection indicator */}
                    {!avatarField || avatarField.length === 0 ? (
                        <div className="text-yellow-500 text-sm">
                            ⚠️ Please select an avatar image (required)
                        </div>
                    ) : (
                        <div className="text-green-500 text-sm">
                            ✅ Avatar selected
                        </div>
                    )}

                    <Input
                        label="Username: "
                        type="text"
                        placeholder="Enter username"
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Username must be at least 3 characters"
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message: "Username can only contain letters, numbers, and underscores"
                            }
                        })}
                        className="h-8"
                    />
                    {errors.username && (
                        <span className="text-red-500 text-sm">
                            {errors.username.message}
                        </span>
                    )}

                    <Input
                        label="Email: "
                        type="email"
                        placeholder="Enter email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email address"
                            }
                        })}
                        className="h-8"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">
                            {errors.email.message}
                        </span>
                    )}

                    <Input
                        label="Full Name: "
                        type="text"
                        placeholder="Enter full name"
                        {...register("fullName", {
                            required: "Full name is required",
                            minLength: {
                                value: 2,
                                message: "Full name must be at least 2 characters"
                            }
                        })}
                        className="h-8"
                    />
                    {errors.fullName && (
                        <span className="text-red-500 text-sm">
                            {errors.fullName.message}
                        </span>
                    )}

                    <Input
                        label="Password: "
                        type="password"
                        placeholder="Enter password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        className="h-8"
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">
                            {errors.password.message}
                        </span>
                    )}

                    <Button
                        type="submit"
                        bgColor="bg-purple-500"
                        className="w-full sm:py-3 py-2 hover:bg-purple-700 text-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>

                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to={"/login"}
                            className="text-purple-600 cursor-pointer hover:opacity-70"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;