'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card/Card';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { User, Mail, Phone, MapPin, Lock, Camera, Save, AlertCircle } from 'lucide-react';
import { updateProfile, changePassword } from '@/lib/actions/user';
import { updateProfilePicture } from '@/lib/actions/user-photo';
import { useRouter } from 'next/navigation';
export const AccountSettingsForm = ({ user }: { user: any }) => {
    const router = useRouter();
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateProfile = async (formData: FormData) => {
        setIsLoadingProfile(true);
        setProfileMessage(null);

        const result = await updateProfile(formData);

        if (result?.error) {
            setProfileMessage({ type: 'error', text: result.error });
        } else {
            setProfileMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
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
        } else {
            setPasswordMessage({ type: 'success', text: 'Password berhasil diubah' });
            // Reset form if possible, or just show success
            (document.getElementById('password-form') as HTMLFormElement)?.reset();
        }
        setIsLoadingPassword(false);
    };

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
                        <form action={async (formData) => {
                            const res = await updateProfilePicture(formData);
                            if (res?.error) alert(res.error);
                        }} id="profile-pic-form" className="w-full flex flex-col items-center">
                            <input
                                type="file"
                                name="photo"
                                id="photo-input"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.length) {
                                        e.currentTarget.form?.requestSubmit();
                                    }
                                }}
                            />

                            <div
                                className="relative mb-4 group cursor-pointer"
                                onClick={() => document.getElementById('photo-input')?.click()}
                            >
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner bg-gray-100">
                                    {user.image ? (
                                        <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mb-4 text-center">
                                Klik gambar untuk mengubah.<br />
                                Format: JPG, PNG. Kl. 2MB.
                            </p>
                        </form>
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
