    import { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { z } from 'zod';
    import { useDispatch } from 'react-redux';
    import toast from 'react-hot-toast';
    import { UserPlus, Mail, Lock, Eye, EyeOff, User, Upload } from 'lucide-react';
    import { authAPI } from '../../features/auth/authAPI';
    import { setCredentials } from '../../features/auth/authSlice';

    const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
    });

    const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
        const { confirmPassword, ...userData } = data;
        
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        if (selectedFile) {
            formData.append('profileImage', selectedFile);
        }

        const response = await authAPI.register(formData);
        
        dispatch(
            setCredentials({
            user: {
                _id: response._id,
                name: response.name,
                email: response.email,
                profileImage: response.profileImage,
            },
            token: response.token,
            })
        );

        toast.success('Registration successful!');
        navigate('/dashboard');
        } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
        <div className="max-w-md w-full">
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 mb-4">
                <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                Join Smart Notes and start organizing your thoughts
            </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Image Upload */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Image (Optional)
                </label>
                <div className="flex items-center space-x-4">
                    {previewImage ? (
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary-500"
                    />
                    ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                    </div>
                    )}
                    <label className="cursor-pointer btn-secondary flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    </label>
                </div>
                </div>

                {/* Name */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    {...register('name')}
                    type="text"
                    className="input-field pl-10"
                    placeholder="John Doe"
                    />
                </div>
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
                </div>

                {/* Email */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    {...register('email')}
                    type="email"
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
                </div>

                {/* Password */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                </div>

                {/* Confirm Password */}
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
                </div>

                {/* Submit Button */}
                <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                {isLoading ? (
                    <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                    </>
                ) : (
                    <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                    </>
                )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:text-primary-500"
                >
                    Sign in
                </Link>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default Register;