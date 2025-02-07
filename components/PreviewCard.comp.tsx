import Image from "next/image";
import {Calendar} from 'lucide-react'
import { Input } from "postcss";
type Props = {
  url: string;
  name: string;
  onDelete: () => void;
};
export function ImagePreviewCard({ url, onDelete, name }: Props) {
  return (
    <div className="flex flex-col">
      <Image
        src={url}
        width={300}
        height={200}
        className="w-full object-cover"
        alt=""
      />
      <footer className="mt-2 flex justify-between items-center">

            <button>

                <div className="flex gap-2 items-center">
                <Calendar size={18} />
                <input type="date" className="placeholder:text-gray-600 text-lime-800" />
                
                </div>
            </button>


      </footer>
    </div>
  );
}
