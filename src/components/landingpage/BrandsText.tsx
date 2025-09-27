import Image from "next/image"

interface BrandsTextData {
  title: string
  content: string
  img1: string
  img2: string
  img3: string
  img4: string
  img5: string
  img6: string
}

interface BrandsTextProps {
  data: BrandsTextData
}

const BrandsText = ({ data }: BrandsTextProps) => (

          <div className="bg-background lg:py-24 py-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
                <div className="mx-auto w-full max-w-xl lg:mx-0">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">{data.title}</h2>
                  <p className="mt-6 lg:text-lg lg:leading-7 text-muted-foreground">
                    {data.content}
                  </p>
                  
                </div>
                <div className="mx-auto grid w-full max-w-xl grid-cols-2 items-center gap-y-6 gap-x-6 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:pl-8">
                  <Image
                    className="max-h-12 w-full object-contain object-left"
                    src={data.img1}
                    alt="Tuple"
                    width={105}
                    height={48}
                    unoptimized
                  />
                  <Image
                    className="max-h-12 w-full object-contain object-left"
                    src={data.img2}
                    alt="Reform"
                    width={104}
                    height={48}
                    unoptimized
                  />
                  <Image
                    className="max-h-12 w-full object-contain object-left"
                    src={data.img3}
                    alt="SavvyCal"
                    width={140}
                    height={48}
                    unoptimized
                  />
                  <Image
                    className="max-h-12 w-full object-contain object-left"
                    src={data.img4}
                    alt="Laravel"
                    width={136}
                    height={48}
                    unoptimized
                  />
                  <Image
                    className="max-h-12 w-full object-contain object-left"
                    src={data.img5}
                    alt="Transistor"
                    width={158}
                    height={48}
                    unoptimized
                  />
                  <Image
                    className="max-h-12 w-full object-contain object-left"
                    src={data.img6}
                    alt="Statamic"
                    width={147}
                    height={48}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

      
)
export default BrandsText