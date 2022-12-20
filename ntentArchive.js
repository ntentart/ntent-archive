////////////////////////////
//
// Archive by ntent.art
// Assists in archiving multimedia and html-native content with nft.storage and IPFS.
// Author : jiwa (@dotjiwa)
//
////////////////////////////

const { NFTStorage, File } = require('nft.storage')
var mime = require('mime-types')

class NtentArchive {
    ////////////////////////////
    //Initialize w/ nft.storage API Key
    ////////////////////////////
    constructor(NFT_STORAGE_TOKEN, preferredGatewayBaseUrl = null) {
        //Pass in your nft.storage API key
        this.client = new NFTStorage({
            token: NFT_STORAGE_TOKEN,
        })

        //optionally, include your IPFS gateway use for https:// url results
        this.preferredGatewayBaseUrl = preferredGatewayBaseUrl

        this.enforceTags = false
    }

    ////////////////////////////
    //
    // Archive Token - archives multimedia content + NFT metadata.
    // Includes support for html-based projects.
    // Easily uploaded to IPFS via NFT.STORAGE for decentralized storage.
    //
    // Takes 4 parameters,
    // 1. Compliant ERC-721 NFT Metadata, example below. https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
    // 2. Content Options object, example below.
    // 3. Tags used to find this content later, ie search, etc.
    // 4. Optionally, include your creator id if you've been given one.
    //
    ////////////////////////////
    //1. Compliant NFT Metadata Example JSON
    // {
    //     "platform": "ntent.art",
    //     "name": "Moment After",
    //     "series": "1",
    //     "description": "Moment After by ntent.art is a 1 of 1 piece of digital art at the intersection of multimedia, performance, and abstract generative art.  Moment After combines the human side of interaction and technology with the ephemeral nature of performance + the permanence of the blockchain.  Moment After brings attention to the moment after the climax in any interaction.  Do you feel good, or do you feel off?  Feel into the moment after. Please allow 10-15 minutes for loading to complete.",
    //     "external_url": "https://app.ntent.art/n/project/8",
    //     "artist": "ntent.art",
    //     "collection_name": "ntent.art",
    //     "traits": [{
    //         "trait_type": "Project",
    //         "value": "1 of 1's"
    //     }],
    //     "attributes": [{
    //         "trait_type": "Project",
    //         "value": "1 of 1's"
    //     }],
    //     "features": ["Project : 1 of 1's"],
    //     "website": "https://app.ntent.art",
    //     "tokenID": "1",
    //     "license": "MIT",
    //     "projectId": "1",
    //     "image": "https://hosted.ntent.art/images/ma.jpeg",
    //     "full_screen_url": "https://hosted.ntent.art/projects/moment-after/index.html",
    //     "animation_url": "https://hosted.ntent.art/projects/moment-after/index.html",
    //     "interactive_nft": {
    //         "code_uri": "https://hosted.ntent.art/projects/moment-after/index.html"
    //     }
    // }

    // 2. Content Options Properties
    // {
    //     image : {
    //         buffer : buffer,
    //         filename : filename
    //     },
    //     gif : {
    //         buffer : buffer,
    //         filename : filename
    //     },
    //     video : {
    //         buffer : buffer,
    //         filename : filename
    //     },
    //     other : {
    //         buffer : buffer,
    //         filename : filename
    //     },
    //     html: {
    //         files: files,
    //         rootFolder : rootFolder
    //     },
    //     collection: {
    //         files: files,
    //         rootFolder : rootFolder
    //     },
    // }
    // ** 'files' objects for html and collection must be an array of buffers
    // **  populate 'rootFolder' with root project folder if applicable
    archiveToken(nftMetadata, contentOptions, tags, creatorId = null) {
        return new Promise(async (resolve, reject) => {
            // append creator id if given
            if (creatorId) {
                nftMetadata.creatorId = creatorId
            } 

            // lookup mime content types
            this.#lookupMimeTypes(contentOptions);

            var result = this.#validateToken(nftMetadata, tags, contentOptions);
            if (!result.valid) {
                reject(new Error(result.message))
                return
            }

            this.#attachArchivalInformation(nftMetadata, contentOptions, tags);

            await this.#attachNFTContent(nftMetadata, contentOptions);

            const metadata = await this.client.store(nftMetadata);

            this.#finalizeMetadata(metadata);

            resolve(metadata.data);
        }).catch((e) => console.log(e))
    }

    ////////////////////////////
    //
    // Archive File - archives one file at a time.
    //
    // Takes 4 parameters,
    // 1. Any metadata you would like to include. Name and description are required.
    // 2. Content Options object, example above.
    // 3. Tags used to find this content later, ie search, etc.
    // 4. Optionally, include your creator id if you've been given one.
    ////////////////////////////
    archiveFile(assetMetadata, contentOptions, tags, creatorId = null) {
        return new Promise(async (resolve, reject) => {
            // append creator id if given
            if (creatorId) {
                assetMetadata.creatorId = creatorId
            }

            // lookup mime content types
            this.#lookupMimeTypes(contentOptions);

            var result = this.#validateFile(assetMetadata, tags, contentOptions);
            if (!result.valid) {
                reject(new Error(result.message))
                return
            }

            this.#attachArchivalInformation(assetMetadata, contentOptions, tags);

            this.#attachFileContent(assetMetadata, contentOptions);

            this.#finalizeMetadata(metadata);

            resolve(metadata.data);
        }).catch((e) => console.log(e))
    }

    ////////////////////////////
    //
    // Archive Collection -
    // archives multiple files at once that should be categorized as a collection
    //
    // Takes 4 parameters,
    // 1. Any metadata you would like to include. Name and description are required.
    // 2. Content Options object, example above.
    // 3. Tags used to find this content later, ie search, etc.
    // 4. Optionally, include your creator id if you've been given one.
    ////////////////////////////
    archiveCollection(assetMetadata, contentOptions, tags, creatorId = null) {
        return new Promise(async (resolve, reject) => {
            // append creator id if given
            if (creatorId) {
                assetMetadata.creatorId = creatorId
            }

            // lookup mime content types
            this.#lookupMimeTypes(contentOptions);

            var result = this.#validateCollection(assetMetadata, tags, contentOptions);
            if (!result.valid) {
                reject(new Error(result.message))
                return
            }

            this.#attachArchivalInformation(assetMetadata, contentOptions, tags);

            await this.#attachCollectionContent(assetMetadata, contentOptions);

            const metadata = await this.client.store(assetMetadata);

            this.#finalizeMetadata(metadata);

            resolve(metadata.data);

        }).catch((e) => console.log(e))
    }

    ////////////////////////////
    //
    // Archive Html Site -
    // Archives html based projects and content.
    //
    // Takes 4 parameters,
    // 1. Any metadata you would like to include. Name and description are required.
    // 2. Content Options object, example above.
    // 3. Tags used to find this content later, ie search, etc.
    // 4. Optionally, include your creator id if you've been given one.
    ////////////////////////////
    archiveHtmlSite(assetMetadata, contentOptions, tags, creatorId = null) {
        return new Promise(async (resolve, reject) => {
            // append creator id if given
            if (creatorId) {
                assetMetadata.creatorId = creatorId
            }

            // lookup mime content types
            this.#lookupMimeTypes(contentOptions)

            var result = this.#validateHtml(assetMetadata, tags, contentOptions)
            if (!result.valid) {
                reject(new Error(result.message))
                return
            }

            this.#attachArchivalInformation(assetMetadata, contentOptions, tags)

            await this.#attachHtmlContent(assetMetadata, contentOptions)

            const metadata = await this.client.store(assetMetadata)

            this.#finalizeMetadata(metadata)

            resolve(metadata.data)
        }).catch((e) => console.log(e))
    }

    //////////////////////////////////////////////////////////////////
    ///////////////////////////
    // Private helper methods
    ////////////////////////////

    #validateFile(metadata, tags, contentOptions) {
        var msg = "";

        // required NFT Properties
        var validationResult = this.#validateFileMetadata(metadata)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        // validate tags
        validationResult = this.#validateTags(tags)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        // validate content
        validationResult = this.#validateFileContent(contentOptions)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        if (msg) return { valid: false, message: msg }
        else return { valid: true }
    }

    #validateCollection(metadata, tags, contentOptions) {
        var msg = "";

        // required NFT Properties
        var validationResult = this.#validateFileMetadata(metadata)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        // validate tags
        validationResult = this.#validateTags(tags)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        // validate content
        validationResult = this.#validateCollectionContent(contentOptions)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        if (msg) return { valid: false, message: msg }
        else return { valid: true }
    }

    #validateHtml(metadata, tags, contentOptions) {
        var msg = "";

        // required NFT Properties
        var validationResult = this.#validateFileMetadata(metadata)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        // validate tags
        validationResult = this.#validateTags(tags)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        // validate content
        validationResult = this.#validateHtmlContent(contentOptions)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        if (msg) return { valid: false, message: msg }
        else return { valid: true }
    }

    #validateToken(metadata, tags, contentOptions) {
        var msg = "";

        // required NFT Properties
        var validationResult = this.#validateNFTMetadata(metadata)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        // validate tags
        validationResult = this.#validateTags(tags)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        // validate content
        validationResult = this.#validateNFTContent(contentOptions)
        if (!validationResult.valid) {
            msg += validationResult.message
        }

        if (msg) return { valid: false, message: msg }
        else return { valid: true }
    }

    #lookupMimeTypes(contentOptions) {
        if (contentOptions.image) {
            contentOptions.image.mimetype = mime.lookup(
                contentOptions.image.filename
            )
        }
        if (contentOptions.gif) {
            contentOptions.gif.mimetype = mime.lookup(
                contentOptions.gif.filename
            )
        }
        if (contentOptions.video) {
            contentOptions.video.mimetype = mime.lookup(
                contentOptions.video.filename
            )
        }
        if (contentOptions.other) {
            contentOptions.other.mimetype = mime.lookup(
                contentOptions.other.filename
            )
        }
        if (contentOptions.html) {
            contentOptions.html.files.forEach((f) => {
                f.mimetype = mime.lookup(f.filename)
            })
        }
    }

    #attachArchivalInformation(metadata, contentOptions, tags) {
        if (contentOptions.image) {
            if (
                !contentOptions.gif &&
                !contentOptions.video &&
                !contentOptions.other &&
                !contentOptions.html &&
                !contentOptions.collection
            ) {
                tags.push('image')
                tags.push(contentOptions.image.mimetype)
                tags.push(contentOptions.image.filename)
            }
        }

        if (contentOptions.gif) {
            tags.push('gif')
            tags.push(contentOptions.image.filename)
        }

        if (contentOptions.video) {
            tags.push('video')
            tags.push(contentOptions.video.mimetype)
            tags.push(contentOptions.video.filename)
        }
        if (contentOptions.other) {
            tags.push('other')
            tags.push(contentOptions.other.mimetype)
            tags.push(contentOptions.other.filename)
        }

        if (contentOptions.html) {
            tags.push('html')
        }

        if (contentOptions.collection) {
            tags.push('collection')
        }

        metadata.archivalTags = tags
        metadata.created = Date.now()
        metadata.createdFriendly = new Date(Date.now()).toTimeString()
    }

    #attachNFTContent(nftMetadata, contentOptions) {
        return new Promise(async (resolve, reject) => {
            if (contentOptions.image) {
                const file = new File(
                    [contentOptions.image.buffer],
                    contentOptions.image.filename,
                    {
                        type: contentOptions.image.mimetype,
                    }
                )
                nftMetadata.image = file
            }

            if (contentOptions.gif) {
                const file = new File(
                    [contentOptions.gif.buffer],
                    contentOptions.gif.filename,
                    {
                        type: contentOptions.gif.mimetype,
                    }
                )

                if (!nftMetadata.image) nftMetadata.image = file

                this.#setAnimatedNFTProperties(nftMetadata, file)
            }

            if (contentOptions.video) {
                const file = new File(
                    [contentOptions.video.buffer],
                    contentOptions.video.filename,
                    {
                        type: contentOptions.video.mimetype,
                    }
                )
                this.#setAnimatedNFTProperties(nftMetadata, file)
            }

            if (contentOptions.other) {
                const file = new File(
                    [contentOptions.other.buffer],
                    contentOptions.other.filename,
                    {
                        type: contentOptions.other.mimetype,
                    }
                )
                this.#setAnimatedNFTProperties(nftMetadata, file)
            }

            if (contentOptions.html) {
                contentOptions.html.filesReady = []

                contentOptions.html.files.forEach((f) => {
                    var relativePath = f.path.replace(
                        contentOptions.html.rootFolder,
                        ''
                    )
                    const file = new File([f.buffer], relativePath, {
                        type: f.mimetype,
                    })
                    contentOptions.html.filesReady.push(file)
                })

                var result = await this.client.storeDirectory(
                    contentOptions.html.filesReady
                )
                nftMetadata.projectIpfsCid = result

                var projectUrl = 'ipfs://' + result + '/index.html'
                this.#setAnimatedNFTProperties(nftMetadata, projectUrl)

                if (this.preferredGatewayBaseUrl)
                    nftMetadata.projectGatewayUrl =
                        'https://' +
                        result +
                        '.' +
                        this.preferredGatewayBaseUrl +
                        '/index.html'
            }

            resolve()
        })
    }

    #attachFileContent(assetMetadata, contentOptions) {
        var file
        if (contentOptions.image) {
            file = new File(
                [contentOptions.image.buffer],
                contentOptions.image.filename,
                {
                    type: contentOptions.image.mimetype,
                }
            )
            assetMetadata.image = file
        }
        if (contentOptions.gif) {
            file = new File(
                [contentOptions.gif.buffer],
                contentOptions.gif.filename,
                {
                    type: contentOptions.gif.mimetype,
                }
            )
            assetMetadata.gif = file
        }
        if (contentOptions.video) {
            file = new File(
                [contentOptions.video.buffer],
                contentOptions.video.filename,
                {
                    type: contentOptions.video.mimetype,
                }
            )
            assetMetadata.video = file
        }
        if (contentOptions.other) {
            file = new File(
                [contentOptions.other.buffer],
                contentOptions.other.filename,
                {
                    type: contentOptions.other.mimetype,
                }
            )
            assetMetadata.other = file
        }
        assetMetadata.asset = file
    }

    #attachCollectionContent(assetMetadata, contentOptions) {
        return new Promise(async (resolve) => {
            //handle preview
            var file = new File(
                [contentOptions.image.buffer],
                contentOptions.image.filename,
                {
                    type: contentOptions.image.mimetype,
                }
            )
            assetMetadata.image = file

            //handle collection

            contentOptions.collection.filesReady = []

            contentOptions.collection.files.forEach((f) => {
                var relativePath = f.path.replace(
                    contentOptions.collection.rootFolder,
                    ''
                )
                const file = new File([f.buffer], relativePath, {
                    type: f.mimetype,
                })
                contentOptions.collection.filesReady.push(file)
            })

            var result = await this.client.storeDirectory(
                contentOptions.collection.filesReady
            )
            assetMetadata.ipfsCid = result
            assetMetadata.ipfsUrl = 'ipfs://' + result
            assetMetadata.assets = contentOptions.collection.files.map((f) =>
                f.path.replace(contentOptions.collection.rootFolder, '')
            )

            if (this.preferredGatewayBaseUrl)
                assetMetadata.directoryGatewayUrl =
                    'https://' + result + '.' + this.preferredGatewayBaseUrl

            resolve()
        })
    }

    #attachHtmlContent(assetMetadata, contentOptions) {
        return new Promise(async (resolve) => {
            //handle preview
            var file = new File(
                [contentOptions.image.buffer],
                contentOptions.image.filename,
                {
                    type: contentOptions.image.mimetype,
                }
            )
            assetMetadata.image = file

            //upload HTML
            contentOptions.html.filesReady = []

            contentOptions.html.files.forEach((f) => {
                var relativePath = f.path.replace(
                    contentOptions.html.rootFolder,
                    ''
                )
                const file = new File([f.buffer], relativePath, {
                    type: f.mimetype,
                })
                contentOptions.html.filesReady.push(file)
            })

            var result = await this.client.storeDirectory(
                contentOptions.html.filesReady
            )
            assetMetadata.ipfsCid = result
            assetMetadata.ipfsUrl = 'ipfs://' + result + '/index.html'

            if (this.preferredGatewayBaseUrl)
                assetMetadata.directoryGatewayUrl =
                    'https://' +
                    result +
                    '.' +
                    this.preferredGatewayBaseUrl +
                    '/index.html'

            resolve()
        })
    }

    #setAnimatedNFTProperties(nftMetadata, val) {
        nftMetadata.full_screen_url = val
        nftMetadata.animation_url = val
        nftMetadata.interactive_nft = {
            code_uri: val,
        }
    }

    #validateNFTMetadata(nftMetadata) {
        var valid = true
        var msg = ''

        if (!nftMetadata.name) {
            valid = false
            msg += "'name' is required. "
        }
        if (!nftMetadata.description) {
            valid = false
            msg += "'description' is required. "
        }
        if (!nftMetadata.artist) {
            valid = false
            msg += "'artist' is required. "
        }
        if (!nftMetadata.collection_name) {
            valid = false
            msg += "'collection_name' is required. "
        }

        return {
            valid: valid,
            message: this.#errorPreface() + msg,
        }
    }

    #validateFileMetadata(fileMetadata) {
        var valid = true
        var msg = ''

        if (!fileMetadata.name) {
            valid = false
            msg += "'name' is required. "
        }
        if (!fileMetadata.description) {
            valid = false
            msg += "'description' is required. "
        }

        return {
            valid: valid,
            message: this.#errorPreface() + msg,
        }
    }

    #validateTags(tags) {
        var valid = true
        var msg = ''

        tags.forEach((t) => {
            if (typeof t === 'string') t = t.toLowerCase().trim()
            else {
                valid = false
                msg += 'tags must be strings. '
            }
        })

        if (this.enforceTags)
            if (tags.length < 5) {
                valid = false
                msg +=
                    'Must include a minimum of 5 tags! This is so we can find this content later! '
            }

        tags = [...new Set(tags)]

        return {
            valid: valid,
            message: this.#errorPreface() + msg,
        }
    }

    #validateNFTContent(contentOptions) {
        var valid = true
        var msg = ''

        //enforce gif file extension
        if (contentOptions.gif)
            if (contentOptions.gif.filename.indexOf('.gif') == -1) {
                valid = false
                msg += "file provided doesn't have extension .gif"
            }

        // all tokens require a preview image or gif
        if (!contentOptions.image && !contentOptions.gif) {
            valid = false
            msg += "'image' metadata property is required."
        }

        //ensure compliant html folder input
        if (contentOptions.html) {
            contentOptions.html.files.forEach((f) => {
                if (!f.filename) {
                    valid = false
                    msg += 'Filename cannot be empty.'
                }
                if (!f.buffer) {
                    valid = false
                    msg += 'Buffer cannot be empty.'
                }
            })

            //cannot include video or other file for html projects
            if (contentOptions.video || contentOptions.other) {
                valid = false
                msg +=
                    "Cannot have an 'html' project with 'video' or 'other' projects at the same time."
            }
        }

        // use video or other file, not both
        if (contentOptions.video && contentOptions.other) {
            valid = false
            msg += "Cannot have a 'video' and 'other' project at the same time."
        }

        return {
            valid: valid,
            message: this.#errorPreface() + msg,
        }
    }

    #validateFileContent(contentOptions) {
        var valid = true
        var msg = ''

        var filesFound = 0

        if (!contentOptions.image) {
            valid = false
            msg += 'A preview image at minimum is required for every archival. '
        }

        if (contentOptions.image) {
            filesFound++
        }

        //enforce gif file extension
        if (contentOptions.gif) {
            if (contentOptions.gif.filename.indexOf('.gif') == -1) {
                valid = false
                msg += "file provided doesn't have extension .gif"
            }
            filesFound++
        }

        // use video or other file, not both
        if (contentOptions.video) {
            filesFound++
        }

        if (contentOptions.other) {
            filesFound++
        }

        //ensure compliant html folder input
        if (contentOptions.html) {
            valid = false
            msg +=
                "this method is for single files, use 'archiveHtmlSite' function instead. "
        }

        if (filesFound == 0) {
            valid = false
            msg += 'no files found! '
        }

        if (filesFound > 1) {
            valid = false
            msg += 'For this method, you can only attach one file at a time.'
        }

        return {
            valid: valid,
            message: this.#errorPreface() + msg,
        }
    }

    #validateCollectionContent(contentOptions) {
        var valid = true
        var msg = ''

        if (!contentOptions.image) {
            valid = false
            msg += 'A preview image at minimum is required for every archival. '
        }

        if (!contentOptions.collection) {
            valid = false
            msg += "Please use the 'bulk' option for bulk operations."
        }

        return {
            valid: valid,
            message: this.#errorPreface() + msg,
        }
    }

    #validateHtmlContent(contentOptions) {
        var valid = true
        var msg = ''

        if (!contentOptions.image) {
            valid = false
            msg += 'A preview image at minimum is required for every archival. '
        }

        if (!contentOptions.html) {
            valid = false
            msg += "'html' properties are required for html uploads."
        }

        return {
            valid: valid,
            message: this.#errorPreface() + msg,
        }
    }

    #finalizeMetadata(metadata) {
        metadata.data.ipfsCid = metadata.ipnft
        if (this.preferredGatewayBaseUrl)
            metadata.data.gatewayUrl =
                'https://' +
                metadata.data.ipfsCid +
                '.' +
                this.preferredGatewayBaseUrl +
                '/metadata.json'

        return metadata
    }

    #errorPreface() {
        return 'Ntent Archive Metadata Errors : '
    }
}

module.exports = NtentArchive
