export function ravel_img(ctx_resized){
    const img = ctx_resized.getImageData(0, 0, 28, 28).data
    const bw_img_ravel = []

    for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
            const index = (y * 28 + x) * 4
            const brightness = img[index + 3]
            bw_img_ravel.push(brightness)
        }
    }

    return bw_img_ravel
}