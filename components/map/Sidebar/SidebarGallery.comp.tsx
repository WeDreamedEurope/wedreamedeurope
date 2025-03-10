import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContenxt";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import { motion } from "framer-motion";
import { ImageMinusIcon, MapIcon } from "lucide-react";
import Image from "next/image";
const tempShit =
  "https://images.unsplash.com/photo-1485056981035-7a565c03c6aa?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const NoPhotosFound = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col text-gray-300 font-semibold">
      <div className=" max-w-md gap-6  bg-red-500/20 flex flex-col items-center justify-center w-full rounded-md p-2 text-sm aspect-video">
        <div>
          <ImageMinusIcon size={64} className="text-red-200" />
        </div>
        <div className="text-center">
          მოცემული დროით მოცემულ ლოკაციაზე ფოტოები არ მოიძებნა
        </div>
      </div>
      <div className="mt-4">
        <Button
          onClick={onClick}
          size={"lg"}
          className=""
          variant={"secondary"}
        >
          <MapIcon /> რუკის ჩვენება
        </Button>
      </div>
    </div>
  );
};

// const SidebarGallery = () => {
//   const { setSelectedPointId } = useMapContext();

//   const { photos, setStateOfAction } = usePhotoLoader();

//   const RenderGallery = () => {
//     return (
//       <>
//         {photos.map((i, index) => (
//           <div
//             onClick={() => setSelectedPointId(index.toString())}
//             key={index}
//             className="min-w-full h-auto flex flex-col relative sm:border-gray-600 hover:cursor-pointer text-red-300 bg-[#202127] overflow-hidden rounded-md"
//           >
//             <div className="relative w-full aspect-video min-w-full">
//               <Image src={tempShit} fill alt="" className="object-cover" />
//             </div>
//             <div className="text-[#9494bf] font-semibold text-sm px-2 py-2 flex items-center justify-between">
//               <div>{i.dateTakenAt}</div>
//               <div>~ {i.distance.toFixed(2)}მ</div>
//               <div>
//                 <Button size={"sm"}>რუკაზე ნახვა</Button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </>
//     );
//   };

//   return (
//     <article className="w-full relative sm:grid sm:grid-flow-row sm:grid-cols-2 h-auto flex-grow  p-0  place-content-start gap-2 py-5 pointer-events-auto sm:pb-32 text-gray-900 bg-[#121212] space-y-3 px-2">
//       {photos.length > 0 ? (
//         <RenderGallery />
//       ) : (
//         <NoPhotosFound onClick={() => setStateOfAction("idle")} />
//       )}
//     </article>
//   );
// };

function SidebarGallery() {
  const { setStateOfAction } = usePhotoLoader();

  const RenderGallery = () => {
    return (
      <>
        {Array()
          .fill(null)
          .map((i, index) => (
            <div
              onClick={() => {}}
              key={index}
              className="min-w-full h-auto flex flex-col relative sm:border-gray-600 hover:cursor-pointer text-red-300 bg-[#202127] overflow-hidden rounded-md"
            >
              <div className="relative w-full aspect-video min-w-full">
                <Image src={tempShit} fill alt="" className="object-cover" />
              </div>
              <div className="text-[#9494bf] font-semibold text-sm px-2 py-2 flex items-center justify-between">
                <div>{i.dateTakenAt}</div>
                <div>~ {i.distance.toFixed(2)}მ</div>
                <div>
                  <Button size={"sm"}>რუკაზე ნახვა</Button>
                </div>
              </div>
            </div>
          ))}
      </>
    );
  };
  return (
    <motion.div
      key={"uniqueKey111111"}
      initial={{
        y: 100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: 100,
        opacity: 0,
      }}
      transition={{
        duration: 0.57,
        ease: "easeIn",
      }}
      className="w-full h-full overflow-auto "
    >
      <div className="w-full relative sm:grid sm:grid-flow-row sm:grid-cols-2  flex-grow h-auto  p-0  place-content-start gap-2 py-5 pointer-events-auto  text-gray-900 bg-[#121212]  px-2 ">
        {Array(10)
          .fill(null)
          .map((e, index) => (
            <motion.div
              onClick={() => {}}
              key={index}
              className="min-w-full h-auto flex flex-col relative sm:border-gray-600 hover:cursor-pointer text-red-300 bg-[#202127] overflow-hidden rounded-md"
            >
              <div className="relative w-full aspect-video min-w-full">
                <Image src={tempShit} fill alt="" className="object-cover" />
              </div>
              <div className="text-[#9494bf] font-semibold text-sm px-2 py-2 flex items-center justify-between">
                {/* <div>{i.dateTakenAt}</div> */}
                {/* <div>~ {i.distance.toFixed(2)}მ</div> */}
                <div>23/11/2</div>
                <div>~ 222მ</div>
                <div>
                  <Button size={"sm"}>რუკაზე ნახვა</Button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* <NoPhotosFound onClick={() => setStateOfAction("loading")} /> */}
    </motion.div>
  );
}

export const HugeTempElemet = () => {
  return (
    <motion.div
      key={"uniqueKey111111"}
      initial={{
        y: 100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: 100,
        opacity: 0,
      }}
      transition={{
        duration: 0.57,
        ease: "easeIn",
      }}
      className="bg-yellow-600 overflow-auto no"
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti iste
      optio sequi qui rem, id obcaecati autem ducimus porro sed non, dolore
      nulla aut repellat veritatis tempora necessitatibus illo, dolorem quis.
      Unde porro nemo aliquam suscipit facilis, voluptas, corrupti reprehenderit
      sed amet voluptatem iusto ipsam? Quaerat laudantium suscipit vitae facere,
      maiores et ad ut esse accusantium officiis quos eligendi nam, sequi, animi
      dicta. Modi maiores blanditiis error sit similique, quaerat molestiae
      sequi, corporis tempora doloremque minus explicabo ipsa. Unde minus nam
      assumenda molestiae dolorem praesentium, eos repellendus modi ex harum
      alias rem aut natus sapiente laborum non distinctio aliquid odit?
      Veritatis totam ullam vel adipisci eligendi iusto non consequuntur magnam
      ad architecto repudiandae sapiente recusandae doloribus saepe qui dolores
      cupiditate, fugiat explicabo laborum? Quod et unde illo dolores minima
      eum, iure illum pariatur sit sequi, ducimus minus, odio totam. Quisquam
      nemo molestias reiciendis necessitatibus blanditiis ea deleniti quas
      doloribus distinctio. Commodi perferendis quisquam odit architecto id!
      Eveniet, odit dignissimos explicabo nostrum natus neque. A mollitia
      debitis inventore modi fugit ducimus, esse deserunt autem temporibus non,
      velit magni. Neque architecto recusandae minus et. Quod sapiente ipsam
      harum eaque facilis dolor iusto, officiis voluptates sit odio eligendi ab
      praesentium. Doloremque, eos dicta? Lorem ipsum dolor sit amet
      consectetur, adipisicing elit. Commodi tenetur earum quod impedit ullam
      omnis, repellat obcaecati et officia adipisci soluta repudiandae
      exercitationem. Atque quidem facilis quam ipsum cum! Eius saepe, illo
      praesentium dicta et sint ut atque voluptas! Error fugit accusantium
      dolorum modi eum exercitationem autem atque explicabo nostrum sapiente
      velit nihil delectus tempore sed corporis, veniam ducimus mollitia ullam
      ipsa molestias omnis quasi harum ipsam. Suscipit recusandae rem sapiente
      ducimus at aspernatur et facilis vero mollitia. Quidem doloribus
      voluptatum ipsa magni omnis optio natus quae quos, est maxime nisi aperiam
      reprehenderit veritatis amet quo expedita voluptatem, at obcaecati aliquam
      incidunt modi ut neque! Perferendis quam expedita aliquid atque? Iusto
      blanditiis quod necessitatibus laudantium tempore esse deserunt quis
      eveniet perferendis non nulla amet culpa neque hic, explicabo eos commodi
      pariatur aut? Neque porro qui consequatur, et voluptatem impedit cum eum
      ut nostrum dolorem nulla possimus vel iusto quibusdam esse nobis nihil
      atque ad, aut hic tempora! Ullam et libero quos reprehenderit inventore
      laborum modi, molestiae ratione voluptatem exercitationem accusamus!
      Quidem beatae voluptate sit ex nulla eos iure sed aliquid ut odit. Libero
      dicta vel delectus laborum, quia quod, tempora ullam possimus perferendis
      sed reprehenderit, autem reiciendis illo deserunt. Quis expedita quasi
      optio sequi est nemo dolores eaque, veniam iusto deserunt illo
      perspiciatis dignissimos molestias culpa, dolor doloremque nihil id, sunt
      adipisci esse odit quisquam! Laudantium porro sapiente minima minus.
      Fugiat laboriosam sunt id quod eius adipisci voluptatem, odio maiores
      placeat at cupiditate facilis deserunt, eum quia tenetur sequi odit
      commodi iste quaerat consequuntur magnam distinctio. In minima voluptatem
      nostrum, officiis voluptatum dolorum dolor dolores tempora iusto
      reiciendis repellendus distinctio! Quaerat necessitatibus doloribus
      officiis perferendis expedita molestias obcaecati cum. Aut quaerat
      temporibus deserunt adipisci quasi vero tenetur eligendi dolorum earum
      exercitationem ab in eum quibusdam velit quam, amet impedit magnam
      perspiciatis odit illo numquam sapiente. Suscipit laboriosam culpa natus
      accusamus nisi! Commodi rerum in vero distinctio sed. Voluptas voluptates
      nesciunt laboriosam ab dolorum in ipsam ratione vel veritatis aspernatur
      exercitationem voluptatibus rem, ut illo. Ipsam veniam corrupti neque!
      Necessitatibus ex pariatur omnis numquam, laudantium exercitationem
      similique tempora accusantium vitae cupiditate? Nisi cupiditate, ut minus
      necessitatibus soluta culpa deleniti consequatur ducimus maiores
      dignissimos sequi nulla. Repellat expedita labore explicabo officiis
      accusamus iusto quasi eaque ipsam minima dignissimos? Sapiente, maiores
      qui. Mollitia maxime sunt iusto architecto quos ut minus magnam
      perspiciatis, ipsam soluta laboriosam nisi atque ipsum officia facere
      magni, sapiente ex alias expedita dolore reprehenderit minima tempore.
      Ipsam perferendis atque rem commodi non laborum eum, praesentium cumque
      sunt obcaecati voluptate repudiandae dolores doloremque vitae facere odio
      necessitatibus provident. Error, odio! Eveniet repudiandae nesciunt vitae
      officia ad deleniti, asperiores magnam maiores expedita soluta nam debitis
      dolorem adipisci fugiat quidem totam? Blanditiis illum porro voluptate
      molestiae omnis est exercitationem nostrum magnam ea doloremque delectus
      distinctio atque ut corporis facilis, reiciendis, unde ipsa sed, qui non.
      Unde architecto cumque autem omnis beatae? Laborum fuga atque corrupti
      nisi qui ducimus recusandae autem quod? Officia, dolores natus, autem,
      exercitationem temporibus laborum fugiat delectus beatae odit porro
      inventore voluptatem tempore minus quam ipsa. Animi nemo, rerum eum
      aspernatur reprehenderit dicta fuga, mollitia aperiam, quo nesciunt optio
      repellendus. Quos commodi suscipit eligendi error, officiis, quaerat velit
      accusantium aliquid distinctio deleniti, nisi iusto quis rem doloribus
      doloremque optio pariatur voluptatum dolorem placeat quia exercitationem.
      Cupiditate, tempora, iure accusantium doloribus magnam, id nobis officiis
      consequatur ipsa eius aliquam illum praesentium cumque modi exercitationem
      reprehenderit quia ipsum sit nesciunt architecto fugiat suscipit ea
      consequuntur? Veniam libero praesentium sapiente iure error, consequatur
      quidem aperiam exercitationem assumenda nulla voluptate vero impedit
      reprehenderit aliquid labore voluptatem vel qui deserunt fugiat deleniti
      doloribus. Soluta, itaque quam repellat quasi neque doloremque vel aliquid
      in corrupti consectetur. Assumenda beatae iure quibusdam possimus deserunt
      laborum magni neque similique repudiandae suscipit itaque illo, modi totam
      unde dolores mollitia consequatur ex tempora non accusantium voluptates.
      Optio corporis perferendis nam nihil reprehenderit. Dolores quis facilis
      rerum mollitia voluptatibus aut! Sint, atque. Ducimus cupiditate
      exercitationem, possimus praesentium, aliquid sit aperiam voluptas aliquam
      inventore perferendis iste quaerat dolorem ut voluptatibus quia illo
      adipisci dignissimos velit cum id doloremque. Quae unde reprehenderit,
      repellat eveniet nesciunt, quia nihil, nostrum delectus quam repudiandae
      dolores commodi debitis. Reiciendis magnam ipsa quasi impedit veniam atque
      consequatur ea molestiae asperiores facilis! Dignissimos inventore
      quibusdam, aut mollitia quidem molestias delectus odio ipsam id
      reprehenderit accusamus placeat illum! Blanditiis, quia sed praesentium
      hic explicabo et distinctio provident doloremque nisi veritatis neque
      omnis nostrum placeat repudiandae necessitatibus accusamus accusantium id
      reprehenderit quaerat, illo itaque nam. Doloremque modi at cupiditate non,
      aut error veniam eveniet voluptatem deleniti laborum hic fuga quaerat
      dolore consequuntur labore magni sed nam nesciunt sapiente, officia porro
      suscipit? Sapiente, tempora voluptatibus. Officia fugiat iure omnis enim
      minus soluta libero aliquam sint repellat facilis incidunt cum ea
      exercitationem, officiis explicabo, accusantium, autem eligendi nemo
      inventore sapiente quo itaque. Esse laboriosam maiores fugiat officia! Aut
      consectetur numquam harum aliquid, dolorum quasi vitae hic nisi saepe
      amet? Sapiente molestiae aut saepe, aliquam molestias temporibus commodi
      quam doloribus nostrum praesentium eius ex dolore vero explicabo nemo
      nobis nulla velit sequi quae omnis, fugit, perspiciatis harum facere.
      Libero voluptas, modi animi quae ex perspiciatis nisi eaque dicta magni
      dolorum cumque distinctio eos veniam minus repudiandae, unde voluptate,
      dolore soluta rem recusandae eveniet fugiat aperiam. Magni, quaerat. Fugit
      quisquam voluptate incidunt nihil inventore quo repellendus fugiat itaque
      autem? Voluptatem sunt doloremque, animi alias necessitatibus odit at eum!
      Fuga, esse magni quas vitae eligendi architecto, velit quisquam possimus
      totam repudiandae, impedit repellat! Consectetur ducimus iusto fuga
      laborum quis, delectus accusantium mollitia iste non hic blanditiis fugiat
      amet impedit minima in at nihil dicta repudiandae ipsam atque cumque iure
      voluptatum rerum incidunt! Debitis, porro nostrum possimus illo molestiae
      repellendus dolore corrupti, molestias accusamus, vel voluptates
      repudiandae. Eligendi omnis eveniet eaque! Expedita libero, rem fugiat
      dolor quaerat nisi iure non reiciendis modi omnis at illum cum ratione
      totam quis ad laboriosam cumque voluptates veritatis facilis quo magnam,
      explicabo assumenda quam? Dolorem possimus nemo suscipit unde tempore?
      Laborum delectus vero animi impedit quia provident quasi minus vel magnam
      doloremque.
    </motion.div>
  );
};

export default SidebarGallery;

/*  {Array(10)
          .fill(null)
          .map((e, index) => (
            <motion.div className="bg-gray-400 w-full aspect-video" key={index}>
              Hello!
            </motion.div>
          ))} */
