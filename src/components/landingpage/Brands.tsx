import Image from "next/image"

const Brands = () => (
<section className="p-10  border-b">
    <h2 className="pb-10 text-center text-gray-600">Finanzierung mit über 500 Partnern</h2>
    <div className="mx-auto max-w-7xl grid md:grid-cols-10 grid-cols-4 gap-5 ">
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="Huawei" src="/images/logo-dkb.svg"></Image>
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="sparkasse" src="/images/logo-sparkasse.svg"></Image>
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="dbbank" src="/images/logo-bbbank.svg"></Image>
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="lbs" src="/images/logo-lbs.svg"></Image>
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="volk" src="/images/logo-volk.svg"></Image>
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="db" src="/images/logo-db.svg"></Image>
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="ing" src="/images/logo-ing.svg"></Image>
        <Image className="w-auto mx-auto flex self-center " width={200} height={50} alt="lbs" src="/images/logo-leipziger.svg"></Image>
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="wustenrot" src="/images/logo-wustenrot.svg"></Image>
        <Image className="w-auto h-10 mx-auto flex self-center " width={200} height={50} alt="psd" src="/images/logo-psd.svg"></Image>

    </div>
    

</section>
)
export default Brands