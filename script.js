const generateForm = document.querySelector(".generate-form");
const image_gallery = document.querySelector(".image-gallery");

const unsplash_API="FE2BK7vOoGnEuCifrUxZYZ6j4Me5Q6zTokiOmxwC-X8";

const updateImageCard=(imgDataArray)=>{
    imgDataArray.forEach((imgObject, index)=>{
        const imgCard = image_gallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn=imgCard.querySelector(".download-btn");

        //set the image source to the unsplash image data
        const unsplashImg=imgObject.urls.small;
        imgElement.src=unsplashImg;

        // when the image is loaded, remove the loading class and set download attributes
        imgElement.onload=()=>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",unsplashImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        };
    });
};

const generateAiImages=async (userPrompt, userImgQuantity)=>{
    try{
        // send a request to the openAI API to generate images based on user inputs
        const response=await fetch(`https://api.unsplash.com/search/photos?query=${userPrompt}&per_page=${userImgQuantity}&client_id=${unsplash_API}`,{
            method: "GET",
            headers:{
                "Authorization":`Client_ID ${unsplash_API}`
            }
        });

        if(!response.ok){
             throw new Error("Failed! Please try again later.");
        }
        const{results}=await response.json(); 
        //get data from the response
        // console.log(data);
        updateImageCard(results);
    }catch(error){
        alert(error.message); 
    }
};

const handleFormSubmission=(e)=>{
    e.preventDefault();
    // console.log(e.srcElement);

// get user input and image quantity values from the form
    const userPrompt=e.srcElement[0].value;
    const userImgQuantity =e.srcElement[1].value;
    // console.log(userPrompt,userImgQuantity);

// Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity}, ()=>
    `<div class="img-card loading">
        <img src="images/loader.svg" alt="image"></img>
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon"></img>
        </a>
    </div>`
    ).join("");
    // console.log(imgCardMarkup);

    image_gallery.innerHTML=imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);

};
generateForm.addEventListener("submit", handleFormSubmission);
