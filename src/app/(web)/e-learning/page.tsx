"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ELearningPage() {
  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      {/* --- HERO SECTION (LOGIN GATEWAY) --- */}
      <section className="relative bg-[#024BA6] pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        {/* Background Tech Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <span className="bg-[#F59E0B] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block animate-pulse">
                Digital Learning Ecosystem
              </span>
              <h1 className="text-4xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Belajar Tanpa Batas, <br/>
                <span className="text-[#F59E0B] underline decoration-4 decoration-[#D4420C]">Kapan Saja!</span>
              </h1>
              <p className="text-white/80 text-lg lg:text-xl font-light mb-10 max-w-xl leading-relaxed">
                Akses ribuan bank soal, video pembahasan, dan simulasi ujian berbasis komputer (CBT) untuk maksimalkan persiapanmu.
              </p>
              
              {/* THE BIG CBT BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login" target="_blank" className="group relative bg-[#F59E0B] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_10px_40px_-10px_rgba(245,158,11,0.8)] hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,1)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    <i className="fas fa-rocket text-2xl group-hover:animate-bounce"></i>
                    MASUK APLIKASI CBT
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-2xl"></div>
                </Link>
                <button className="px-10 py-5 rounded-2xl font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <i className="fas fa-play-circle text-xl"></i> Panduan Pengguna
                </button>
              </div>
              <p className="text-white/60 text-xs mt-4 italic">
                *Gunakan akun siswa Qubic yang telah terdaftar untuk masuk.
              </p>
            </div>

            {/* Dashboard Mockup Image */}
            <div className="lg:w-1/2 relative w-full max-w-[600px]">
              <div className="relative z-10 bg-[#024BA6] rounded-[2rem] p-4 shadow-2xl border-4 border-[#024BA6]">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-900 shadow-inner">
                    {/* Ganti src ini dengan screenshot asli aplikasi CBT Qubic Anda nantinya */}
                    <Image 
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015" 
                        alt="Dashboard CBT Mockup" 
                        fill 
                        className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                    />
                    {/* Overlay UI Fake */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gray-800 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                        <div className="text-gray-400 text-xs ml-4 font-mono">cbt.qubic.id/dashboard</div>
                    </div>
                  </div>
              </div>
              {/* Decor Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#F59E0B]/20 blur-[100px] rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- KEY FEATURES SECTION --- */}
      <section className="py-24 container mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: "Bank Soal Tanpa Batas", desc: "Ribuan koleksi soal TKA, TPS, dan soal mandiri PTLN yang terus diupdate.", icon: "fa-database", color: "#024BA6", bg: "bg-blue-50" },
                { title: "Analisis Nilai Real-time", desc: "Selesai ujian, nilai langsung keluar lengkap dengan analisis kelemahanmu.", icon: "fa-chart-pie", color: "#F59E0B", bg: "bg-amber-50" },
                { title: "Video & Modul Digital", desc: "Akses materi pembelajaran visual kapanpun kamu butuh review ulang.", icon: "fa-film", color: "#D4420C", bg: "bg-orange-50" },
            ].map((feature, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 hover:-translate-y-2 transition-all duration-300 group">
                    <div className={`w-20 h-20 ${feature.bg} rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-sm group-hover:scale-110 transition-transform`} style={{ color: feature.color }}>
                        <i className={`fas ${feature.icon}`}></i>
                    </div>
                    <h3 className="font-black text-2xl mb-4 text-[#024BA6]">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-light">{feature.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* --- CBT HIGHLIGHT SECTION --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 order-2 lg:order-1">
                    <span className="text-[#D4420C] font-bold uppercase tracking-widest mb-2 block">Fitur Unggulan</span>
                    <h2 className="text-4xl lg:text-6xl font-black text-[#024BA6] mb-8 leading-tight">Simulasi Ujian <br/>Senyata Aslinya.</h2>
                    <p className="text-gray-600 text-lg mb-10 leading-relaxed font-light">
                        Sistem CBT kami dirancang meniru tampilan dan tekanan waktu ujian sebenarnya (UTBK/Mandiri). Latih mental dan strategimu sebelum hari-H.
                    </p>
                    <ul className="space-y-6 font-medium text-[#024BA6]">
                        <li className="flex items-center gap-4 p-4 bg-[#024BA6]/5 rounded-2xl border border-[#024BA6]/10">
                            <i className="fas fa-stopwatch text-3xl text-[#D4420C]"></i>
                            <span>Sistem Timer & Blocking Time per sub-tes.</span>
                        </li>
                        <li className="flex items-center gap-4 p-4 bg-[#024BA6]/5 rounded-2xl border border-[#024BA6]/10">
                            <i className="fas fa-project-diagram text-3xl text-[#F59E0B]"></i>
                            <span>Pembahasan detail langkah demi langkah.</span>
                        </li>
                        <li className="flex items-center gap-4 p-4 bg-[#024BA6]/5 rounded-2xl border border-[#024BA6]/10">
                            <i className="fas fa-mobile-alt text-3xl text-[#024BA6]"></i>
                            <span>Akses mudah via Laptop, Tablet, atau HP.</span>
                        </li>
                    </ul>
                </div>
                <div className="lg:w-1/2 order-1 lg:order-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#024BA6]/20 to-[#F59E0B]/20 rounded-[3rem] rotate-6 scale-105 blur-xl"></div>
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                        <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070" alt="Student using CBT" width={800} height={600} className="object-cover" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA REGISTER --- */}
      <section className="py-24 bg-[#024BA6] text-white text-center relative overflow-hidden">
        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
             <i className="fas fa-microchip text-[50rem] -ml-64 -mt-64"></i>
        </div>
        <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-3xl lg:text-5xl font-black mb-8">Belum Punya Akun Akses?</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-12 font-light">
                Fitur E-Learning & CBT eksklusif untuk siswa terdaftar Qubic Bangun Cita. Daftar program sekarang untuk mendapatkan akses penuh.
            </p>
            <Link href="/contact" className="bg-[#F59E0B] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform uppercase inline-block">
                Daftar Program & Dapat Akun
            </Link>
        </div>
      </section>
    </div>
  );
}