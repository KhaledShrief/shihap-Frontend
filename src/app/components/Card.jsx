import { Button } from "@nextui-org/react";

const Card = ({ title, description, imageUrl }) => {
    return (
        <div id="container" className="relative w-[300px] hover:scale-x-[1.1] transition-all ease-in-out duration-700 h-fit">
            <div id="face1" className="absolute w-full h-[50%] rounded-2xl">
                <img src={imageUrl} className="w-full h-full object-cover rounded-2xl " />
            </div>
            <div id="face2" className="  rounded-2xl flex flex-col p-4 gap-2">
                <h1 className="text-white  text-[20px] font-bold">{title}</h1>
                <div className="p-4 w-full h-full">

                    <p className={` ${description.length > 150 ? "max-h-[150px] overflow-y-auto " : ""}p-2 shadow-lg text-[18px]`}>
                        {description}
                    </p>
                </div>
                <div className="flex justify-start">

                    <Button variant="shadow" color="primary">Shop Now</Button>
                </div>
            </div>
        </div>
    );
};

export default Card;
