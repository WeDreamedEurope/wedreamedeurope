import { AlertCircle } from "lucide-react";
export default function UploadPSA({
  shouldDisplay,
}: {
  shouldDisplay: boolean;
}) {
  if (!shouldDisplay) return null;
  return (
    <div className="flex flex-col gap-2  text-sm leading-relaxed  rounded-md text-yellow-100">
      <div className=" bg-opacity-50 border border-yellow-700 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            მესენჯერებიდან (Facebook, Whatsapp, Viber) მიღებულ ფოტოებს
            ჩამოშორებული აქვთ EXIF ინფორმაცია
          </p>
        </div>
      </div>
      {/* <div className=" bg-opacity-50 border border-yellow-700 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <p>iPhone-ის უახლესი მოდელები ფოტოებს იღებს სპეციფიკურ ფორმატში რაც EXIF ინფორმაციის ამოღებას შეუძლებელს ხდის</p>
            </div>  
          </div> */}
    </div>
  );
}
