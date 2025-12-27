 'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card/Card';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { UploadProgress } from '@/components/atoms/UploadProgress';
import { User, Mail, Phone, MapPin, Lock, Camera, Save, AlertCircle, Loader2 } from 'lucide-react';
import { updateProfile, changePassword } from '@/lib/actions/user';
import { updateProfilePicture } from '@/lib/actions/user-photo';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const AccountSettingsForm = ({ user }: { user: any }) => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 2MB');
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);

        setIsUploadingPhoto(true);
        setUploadProgress(0);

        // Simulate progress (since server actions don't support progress)
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 100);

        try {
            const formData = new FormData();
            formData.append('photo', file);

            const result = await updateProfilePicture(formData);

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (result?.error) {
                toast.error(result.error);
                setPreviewImage(null);
            } else {
                toast.success('Foto profil berhasil diperbarui!');
                // Force refresh to update session
                setTimeout(() => {
                    router.refresh();
                }, 500);
            }
        } catch (error) {
            clearInterval(progressInterval);
            toast.error('Gagal mengupload foto');
            setPreviewImage(null);
        } finally {
            setTimeout(() => {
                setIsUploadingPhoto(false);
                setUploadProgress(0);
            }, 1000);
        }
    };

    const handleUpdateProfile = async (formData: FormData) => {
        setIsLoadingProfile(true);
        setProfileMessage(null);

        const result = await updateProfile(formData);

        if (result?.error) {
            setProfileMessage({ type: 'error', text: result.error });
            toast.error(result.error);
        } else {
            setProfileMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
            toast.success('Profil berhasil diperbarui!');
            router.refresh();
        }
        setIsLoadingProfile(false);
    };

    const handleChangePassword = async (formData: FormData) => {
        setIsLoadingPassword(true);
        setPasswordMessage(null);

        const result = await changePassword(formData);

        if (result?.error) {
            setPasswordMessage({ type: 'error', text: result.error });
            toast.error(result.error);
        } else {
            setPasswordMessage({ type: 'success', text: 'Password berhasil diubah' });
            toast.success('Password berhasil diubah!');
            (document.getElementById('password-form') as HTMLFormElement)?.reset();
        }
        setIsLoadingPassword(false);
    };

    const displayImage = previewImage || user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Picture & Basic Info */}
            <div className="lg:col-span-1 space-y-6">
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Foto Profil</CardTitle>
                        <CardDescription>Perbarui foto profil Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                        />

                        <div
                            className={`relative mb-4 group cursor-pointer ${isUploadingPhoto ? 'pointer-events-none' : ''}`}
                            onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
                        >
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner bg-gray-100">
                                <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity ${isUploadingPhoto ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                {isUploadingPhoto ? (
                                    <Loader2 className="text-white animate-spin" size={24} />
                                ) : (
                                    <Camera className="text-white" size={24} />
                                )}
                            </div>
                        </div>

                        <div className="w-full mb-4">
                            <UploadProgress
                                progress={uploadProgress}
                                isUploading={isUploadingPhoto}
                            />
                        </div>

                        <p className="text-sm text-gray-500 mb-4 text-center">
                            Klik gambar untuk mengubah.<br />
                            Format: JPG, PNG. Max 2MB.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Forms */}
            <div className="lg:col-span-2 space-y-8">
                {/* Personal Information */}
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Informasi Pribadi</CardTitle>
                        <CardDescription>Kelola data diri dan kontak Anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleUpdateProfile} className="space-y-4">
                            {profileMessage && (
                                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    <AlertCircle size={16} />
                                    {profileMessage.text}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nama Lengkap"
                                    name="nama"
                                    defaultValue={user.name}
                                    leftIcon={<User size={18} />}
                                />
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Email tidak dapat diubah.</p>
                                </div>
                            </div>

                            <Input
                                label="Nomor Telepon"
                                name="no_hp"
                                defaultValue={user.no_hp || ''} // Handle potentially missing data
                                placeholder="08123456789"
                                leftIcon={<Phone size={18} />}
                            />

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-700" size={18} />
                                    <textarea
                                        name="alamat"
                                        defaultValue={user.alamat || ''} // Handle potentially missing data
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px] text-gray-700 placeholder:text-gray-400"
                                        placeholder="Jl. Contoh No. 123, Kota..."
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <Button type="submit" isLoading={isLoadingProfile} className="bg-[#658C58] text-white hover:bg-[#658C58]/80">
                                    <Save size={18} className="mr-2" />
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Change */}
                <Card shadow="md">
                    <CardHeader>
                        <CardTitle>Keamanan</CardTitle>
                        <CardDescription>Ganti password akun Anda secara berkala.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="password-form" action={handleChangePassword} className="space-y-4">
                            {passwordMessage && (
                                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    <AlertCircle size={16} />
                                    {passwordMessage.text}
                                </div>
                            )}

                            <Input
                                label="Password Saat Ini"
                                name="currentPassword"
                                type="password"
                                placeholder="••••••••"
                                leftIcon={<Lock size={18} />}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Password Baru"
                                    name="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    required
                                />
                                <Input
                                    label="Konfirmasi Password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    required
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <Button type="submit" variant="outline" isLoading={isLoadingPassword} className="bg-[#658C58] text-white hover:bg-[#658C58]/80"   >
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
