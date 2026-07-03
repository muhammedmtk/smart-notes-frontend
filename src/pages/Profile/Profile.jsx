    import { useState } from 'react';
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { z } from 'zod';
    import { useMutation, useQueryClient } from '@tanstack/react-query';
    import { useSelector, useDispatch } from 'react-redux';
    import toast from 'react-hot-toast';
    import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';
    import { authAPI } from '../../features/auth/authAPI';
    import { setCredentials } from '../../features/auth/authSlice';
    import { getProfileImageUrl, getInitials } from '../../utils/profileImage';

    const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
    });

    const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    const profileImageUrl = getProfileImageUrl(user?.profileImage);
    const showAvatar = profileImageUrl && !avatarError;

    // useEffect(() => {
    //     setAvatarError(false);
    // }, [user?.profileImage]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        if (data.password && data.password.trim() !== '') {
            formData.append('password', data.password);
        }
        return authAPI.updateProfile(formData);
        },
        onSuccess: (response) => {
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
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        toast.success('Profile updated successfully!');
        },
        onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
        },
    });

    const onSubmit = (data) => {
        updateMutation.mutate(data);
    };

    return (
        <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>

        {/* User Info Card */}
        <div className="card mb-6">
            <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {showAvatar ? (
                <img
                    key={user?.profileImage}
                    src={profileImageUrl}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                />
                ) : (
                getInitials(user?.name)
                )}
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
            </div>
            </div>
        </div>

        {/* Edit Profile Form */}
        <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Edit Profile
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                />
                </div>
                {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password (leave blank to keep current)
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

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn-primary flex items-center space-x-2"
                >
                {updateMutation.isPending ? (
                    <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                    </>
                ) : (
                    <>
                    <Save className="w-5 h-5" />
                    <span>Update Profile</span>
                    </>
                )}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default Profile;