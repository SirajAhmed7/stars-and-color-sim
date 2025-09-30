const $$ = (e: string, p: Document | HTMLElement = document) => {
    return Array.from(p.querySelectorAll(e));
}

export default $$;