import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

if (!process.env.APP_CLOUDNARY_API_KEY || !process.env.APP_CLOUDNARY_API_SECRET_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("Missing Cloudinary config in .env file");
}

cloudinary.config({ 
  cloud_name: "djxoafwgl", 
  api_key: '588596942299519', 
  api_secret: 'TjBoyVnEVcCiskXgEbfSTknp4rk' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        })
      
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
      console.log(error)
        fs.unlinkSync(localFilePath) 
        return null;
    }
}
const deleteImageFromUrl=(imageUrl)=> {
 const parts = imageUrl.split('/');
  const filename = parts.pop(); 
  const publicId = filename.split('.')[0]; 
 

cloudinary.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
  if (error) {
    console.error('Failed to delete:', error);
  } else {
    console.log('Delete result:', result);
  }
});

}



export {uploadOnCloudinary,deleteImageFromUrl}