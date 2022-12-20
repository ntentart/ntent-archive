var NtentArchive = require("./ntentArchive.js");
const fs = require("fs");

var nftStorageApiKey = "NFT_STORAGE_API_KEY_HERE";
var preferredIpfsGatewayBaseUrl = "ipfs.nftstorage.link";

async function videoNFTExample(){

    //define whatever NFT meta is relevant to you!
    //make sure to include minimum ERC-721 standard properties
    var testMetadata = {
        name: "NFT Upload Test",
        description: "This describes the NFT in great detail.",
        artist: "jiwa",
        collection_name: "Digital Dust Bowl; the Collapse of the Entire Internet"
    }

    //get file buffers of relevant files
    var nftImage = await fs.readFileSync("./assets/example.png");
    var nftVideo = await fs.readFileSync("./assets/example-vid.mp4");

    //initialize ntent archive, passing in nft.storage API Key
    //optionally include preferred gateway 
    var nArchive = new NtentArchive(nftStorageApiKey, preferredIpfsGatewayBaseUrl);

    //ntent archive will trim each string, 
    //convert to lower case, and remove duplicates.
    var tags = ["art", "generative art", "generative", "jiwa", "ntent"];

    // include our relevant content options for this upload
    var contentOptions = {
        image: {
            buffer: nftImage,
            filename: "image.png"
        },
        video: {
            buffer: nftVideo,
            filename: "video.mp4"
        },
    }

    //and let it fly
    var result = await nArchive.archiveToken(testMetadata, contentOptions, tags, "123");

    //success! do what you want with the results
    if(result)
        console.log(JSON.stringify(result));
    else
        console.log("Archive failed! Check the logs.")
}

async function htmlNFTExample(){

     //define whatever NFT meta is relevant to you!
    //make sure to include minimum ERC-721 standard properties
    var testMetadata = {
        name: "NFT Upload Test",
        description: "This describes the NFT in great detail.",
        artist: "jiwa",
        collection_name: "Digital Dust Bowl; the Collapse of the Entire Internet"
    }

    //include preview image for this html page
    var nftImage = await fs.readFileSync("./assets/example.png");

    //define project folder
    var nftGenArtProjectFolder = "./html-site-example";

    //get all directory contents
    //should be an array of objects with this format:
    //{
        // path: `${dirName}/${item.name}`,
        // buffer: fs.readFileSync(`${dirName}/${item.name}`),
        // filename: item.name
    //}
    var nftGenArtProject = await getDirectoryContents(nftGenArtProjectFolder, []);

    //initialize ntent archive, passing in nft.storage API Key
    //optionally include preferred gateway 
    var nArchive = new NtentArchive(nftStorageApiKey, preferredIpfsGatewayBaseUrl);

    //trims each string, converts to lower case, and removes duplicates
    var tags = ["art", "generative art", "generative", "jiwa", "ntent"];

    // include our relevant content options for this upload
    var contentOptions = {
        image: {
            buffer: nftImage,
            filename: "image.png"
        },
        html: {
            files: nftGenArtProject,
            rootFolder : nftGenArtProjectFolder
        }
    }

    //and let it fly
    var result = await nArchive.archiveToken(testMetadata, contentOptions, tags, "123");
    
    //success! do what you want with the results
    if(result)
        console.log(JSON.stringify(result));
    else
        console.log("Archive failed! Check the logs.")
}

async function imageFileOnlyExample(){
    //define whatever metadata is relevant to you!
    //Name and Description are required
    var testMetadata = {
        name: "Generative Output #12345",
        description: "This was a work in progress I created in October 2022",
        artist: "jiwa",
    }

    //get file buffers of relevant files
    var asset = await fs.readFileSync("./assets/example.png");

    //initialize ntent archive, passing in nft.storage API Key
    //optionally include preferred gateway 
    var nArchive = new NtentArchive(nftStorageApiKey, preferredIpfsGatewayBaseUrl);

    //ntent archive will trim each string, 
    //convert to lower case, and remove duplicates.
    var tags = ["art", "generative art", "generative", "jiwa", "ntent"];

    // include our relevant content options for this upload
    // at minimum a preview image is always required
    var contentOptions = {
        image: {
            buffer: asset,
            filename: "image.png"
        }
    }

    //and let it fly
    var result = await nArchive.archiveFile(testMetadata, contentOptions, tags, "123");

    //success! do what you want with the results
    if(result)
        console.log(JSON.stringify(result));
    else
        console.log("Archive failed! Check the logs.")

}

async function collectionExample(){
    //define whatever metadata is relevant to you!
    //Name and Description are required
    var testMetadata = {
        name: "Generative Outputs #12345 & #2345",
        description: "This is a small collection of napkin sketches related to upcoming works from October 2022.",
        artist: "jiwa",
    }

    //get file buffers of relevant files
    var image = await fs.readFileSync("./assets/example.png");
    var video = await fs.readFileSync("./assets/example-vid.mp4");

    //initialize ntent archive, passing in nft.storage API Key
    //optionally include preferred gateway 
    var nArchive = new NtentArchive(nftStorageApiKey, preferredIpfsGatewayBaseUrl);

    //ntent archive will trim each string, 
    //convert to lower case, and remove duplicates.
    var tags = ["art", "generative art", "generative", "jiwa", "ntent"];

    // include our relevant content options for this upload
    // a preview image is required
    var contentOptions = {
        image: {
            buffer: image,
            filename: "preview.png"
        },
        collection: {
            files: [
                {
                    path: "./assets/example.png",
                    buffer: fs.readFileSync("./assets/example.png"),
                    filename: "example.png"
                },
                {
                    path: "./assets/example-vid.mp4",
                    buffer: fs.readFileSync("./assets/example-vid.mp4"),
                    filename: "example-vid.mp4"
                }
            ],
            rootFolder: "./assets"
        },
    }

    //and let it fly
    var result = await nArchive.archiveCollection(testMetadata, contentOptions, tags, "123");
    
    //success! do what you want with the results
    if(result)
        console.log(JSON.stringify(result));
    else
        console.log("Archive failed! Check the logs.")

}

async function htmlOnlyExample(){

    //define whatever metadata is relevant to you!
    //Name and Description are required
    var testMetadata = {
        name: "Generative Output #12345",
        description: "This was a work in progress I created in October 2022",
        artist: "jiwa",
    }

    //preview image required
    var image = await fs.readFileSync("./assets/example.png");

    //define project folder
    var nftGenArtProjectFolder = "./html-site-example";

    //get all directory contents
    //should be an array of objects with this format:
    //{
        // path: `${dirName}/${item.name}`,
        // buffer: fs.readFileSync(`${dirName}/${item.name}`),
        // filename: item.name
    //}
    var nftGenArtProject = await getDirectoryContents(nftGenArtProjectFolder, []);

    //initialize ntent archive, passing in nft.storage API Key
    //optionally include preferred gateway 
    var nArchive = new NtentArchive(nftStorageApiKey, preferredIpfsGatewayBaseUrl);

    //trims each string, converts to lower case, and removes duplicates
    var tags = ["art", "generative art", "generative", "jiwa", "ntent"];

    // include our relevant content options for this upload
    var contentOptions = {
        image: {
            buffer: image,
            filename: "preview.png"
        },
        html: {
            files: nftGenArtProject,
            rootFolder : nftGenArtProjectFolder
        }
    }

    //and let it fly
    var result = await nArchive.archiveHtmlSite(testMetadata, contentOptions, tags, "123");
    
    //success! do what you want with the results
    if(result)
        console.log(JSON.stringify(result));
    else
        console.log("Archive failed! Check the logs.")
}

async function getDirectoryContents(dirName, files) {

    const items = fs.readdirSync(dirName, {
        withFileTypes: true
    });

    for (const item of items) {
        if (item.isDirectory()) {
            getDirectoryContents(`${dirName}/${item.name}`, files);
        } else {
            files.push({
                path: `${dirName}/${item.name}`,
                buffer: fs.readFileSync(`${dirName}/${item.name}`),
                filename: item.name
            });

        }
    }

    return files;
};

//you can try any of the examples you want!
//just comment them in one at a time
async function main() {

    ////NFT Examples////
    //htmlNFTExample();
    videoNFTExample();

    ////Other Examples////
    //imageFileOnlyExample();
    //collectionExample();
    //htmlOnlyExample();
}

main();
