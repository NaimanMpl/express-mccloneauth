export const getBase64Image = async (url: string): Promise<String> => {
    const skinData = await fetch(url);
    const buffer = await skinData.arrayBuffer();
    const base64Skin = Buffer.from(buffer).toString('base64');

    return base64Skin;
}