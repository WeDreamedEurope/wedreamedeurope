export default function UploadPSA() {
  return (
    <div className="flex flex-col gap-2 bg-yellow-500/10 text-sm leading-relaxed p-4 rounded-md text-yellow-100">
      <div>
        1. მესენჯერებში (Facebook, Whatsapp, Viber) მიღებულ ფოტოებს ჩამოჭრილი
        აქვთ EXIF ინფორმაცია 
      </div>
      <div>
        1. iPhone-ის ახალი მოდელები ფოტოებს იღებს სპეციფიკურ ფორმატში რაც
        შეუძლებელს ხდის EXIF ინფორმაციის ამოღებას
      </div>
    </div>
  );
}
