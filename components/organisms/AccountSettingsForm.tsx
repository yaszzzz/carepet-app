'use client';

import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Camera, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/atoms/Card/Card';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';

export const AccountSettingsForm = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Pengaturan berhasil disimpan!');
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <Card shadow="lg">
                <CardHeader>
                    <CardTitle>Profil Pengguna</CardTitle>
                    <CardDescription>Kelola informasi profil publik Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                    {/* Placeholder for user image */}
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 p-2 bg-[#658C58] text-white rounded-full hover:bg-[#557A47] transition-colors shadow-sm"
                                    title="Ganti Foto"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="font-medium text-gray-900">Foto Profil</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Format yang didukung: JPG, PNG. Ukuran maks: 2MB.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <h4 className="font-medium text-gray-900 border-b pb-2">Informasi Pribadi</h4>
                                <Input
                                    label="Nama Lengkap"
                                    placeholder="Masukkan nama lengkap Anda"
                                    defaultValue="Budi Santoso"
                                    leftIcon={<User size={18} />}
                                />
                                <Input
                                    label="Nomor Telepon"
                                    placeholder="0812xxxx"
                                    defaultValue="081234567890"
                                    type="tel"
                                    leftIcon={<Phone size={18} />}
                                />
                                <Input
                                    label="Alamat Email"
                                    placeholder="email@example.com"
                                    defaultValue="budi@example.com"
                                    type="email"
                                    leftIcon={<Mail size={18} />}
                                />
                            </div>

                            {/* Security Settings */}
                            <div className="space-y-6">
                                <h4 className="font-medium text-gray-900 border-b pb-2">Keamanan</h4>
                                <Input
                                    label="Password Lama"
                                    placeholder="Masukkan password lama"
                                    type="password"
                                    leftIcon={<Lock size={18} />}
                                />
                                <Input
                                    label="Password Baru"
                                    placeholder="Masukkan password baru"
                                    type="password"
                                    leftIcon={<Lock size={18} />}
                                />
                                <Input
                                    label="Konfirmasi Password Baru"
                                    placeholder="Ulangi password baru"
                                    type="password"
                                    leftIcon={<Lock size={18} />}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button type="submit" isLoading={loading} leftIcon={<Save size={18} />}>
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
