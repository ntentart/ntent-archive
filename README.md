# ntent-archive
Assists in archiving multimedia and html-native content with nft.storage and IPFS.

<a name="readme-top"></a>


<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ntentart/ntent-archive">
    <img src="assets/logo.gif" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Archive by ntent.art</h3>

  <p align="center">
    Archive by ntent.art assist in archiving multimedia content + NFT metadata. 
    Includes support for html-based projects. Easily uploaded to IPFS via 
    NFT.STORAGE for decentralized storage.
    <br />
    <a href="https://github.com/ntentart/ntent-archive/examples.js"><strong>Explore the examples »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ntentart/ntent-archive/issues">Report Bug</a>
    ·
    <a href="https://github.com/ntentart/ntent-archive/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://ntent.art)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [![NTENT.ART][ntent.art{ width=200px}]][ntent-url]
* [![NFT.STORAGE][nft.storage{ width=200px }]][nftstorage-url]
* [![IPFS][ipfs.io]][ipfs-url{ width=200px }]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

Option 1 : Clone the whole repo

1. Get a free API Key at [https://nft.storage](https://nft.storage)
2. Clone the repo
   ```sh
   git clone https://github.com/ntentart/ntent-archive.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `examples.js`
   ```js
    const nftStorageApiKey = "API_KEY_HERE";
   ```

Option 2 : Install ntent-archive npm package in your project

1. Get a free API Key at [https://nft.storage](https://nft.storage)
2. Install into your project with npm
   ```sh
   npm install ntent-archive
   ```
3. Pass in your API Key to the NtentArchive constructor in your code
   ```js
    var nArchive = new NtentArchive(nftStorageApiKey);
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

    Example 1 : NFT with Html Based Content (maybe a generative art project)

   ```js
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
    
    if(result){
        //success! do what you want with the results
        result.ipfsCid = result.ipnft;
        result.gatewayUrl = "https://" + result.ipfsCid+ "."+ preferredIpfsGatewayBaseUrl  + "/metadata.json";
        console.log(JSON.stringify(result));
    }else{
        console.log("Archive failed! Check the logs.")
    }
   ```

    Example 2 : NFT with Video Content

   ```js
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
    if(result){
        //success! do what you want with the results
        result.ipfsCid = result.ipnft;
        result.gatewayUrl = "https://" + result.ipfsCid+ "."+ preferredIpfsGatewayBaseUrl  + "/metadata.json";
        console.log(JSON.stringify(result));
    }else{
        console.log("Archive failed! Check the logs.")
    }
   ```

   More examples in ./examples.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/ntentart/ntent-archive/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

jiwa - [@ntentart](https://twitter.com/ntentart) - iam@ntent.art

Project Link: [https://github.com/ntentart/ntent-archive](https://github.com/ntentart/ntent-archive)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Thanks to goes to the universe.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ntentart/ntent-archive.svg?style=for-the-badge
[contributors-url]: https://github.com/ntentart/ntent-archive/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ntentart/ntent-archive.svg?style=for-the-badge
[forks-url]: https://github.com/ntentart/ntent-archive/network/members
[stars-shield]: https://img.shields.io/github/stars/ntentart/ntent-archive.svg?style=for-the-badge
[stars-url]: https://github.com/ntentart/ntent-archive/stargazers
[issues-shield]: https://img.shields.io/github/issues/ntentart/ntent-archive.svg?style=for-the-badge
[issues-url]: https://github.com/ntentart/ntent-archive/issues
[license-shield]: https://img.shields.io/github/license/ntentart/ntent-archive.svg?style=for-the-badge
[license-url]: https://github.com/ntentart/ntent-archive/blob/master/LICENSE.txt
[product-screenshot]: assets/banner.png 
[ntent.art]: assets/logo.png 
[ntent-url]: https://ntent.art/
[nft.storage]: assets/nftstorage.png
[nftstorage-url]: https://nft.storage/
[ipfs.io]: assets/ipfs.png
[ipfs-url]: https://ipfs.io/
