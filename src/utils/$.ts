const $ = (e: string, p: Document | HTMLElement = document) => {
    return p.querySelector(e);
};

export default $;