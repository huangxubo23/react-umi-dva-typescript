import request from '@/utils/request';

export async function getProductDetail() {
  return request('https://resource.taobao.com/item/add', {
    method: 'post',
    data: {
      url: 'https://detail.tmall.com/item.htm?id=589815124915&sku_properties=10004:827902415;5919063:6536025',
      activityId: 0,
      categoryId: 0,
    },
    // mode: 'no-cors',
    // credentials: "include",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
      'Origin': 'https://we.taobao.com',
      'Referer': 'https://we.taobao.com/',
      'cookie': 't=1e9e01b5a91b93f8244888c8caa6888c; cna=OgsNFchqcXACAXkhkgiyY5pU; tracknick=huangxubo23; lgc=huangxubo23; tg=0; hng=CN%7Czh-cn%7CCNY; miid=167621931495835411; thw=cn; mt=ci=35_1&np=; _cc_=UIHiLt3xSw%3D%3D; uc3=vt3=F8dByEndqaku8lPqQks%3D&id2=Vvqv90XfYUEw&nk2=CzhMCY363hioOCE%3D&lg2=UIHiLt3xD8xYTw%3D%3D; cookie2=1685b847cefdce8d96d272f99d6fddc7; v=0; _tb_token_=e303ee10abe66; publishItemObj=Ng%3D%3D; dnk=huangxubo23; unb=549657177; uc1=cookie16=V32FPkk%2FxXMk5UvIbNtImtMfJQ%3D%3D&cookie21=U%2BGCWk%2F7owY3j65szkPmZQ%3D%3D&cookie15=VT5L2FSpMGV7TQ%3D%3D&existShop=true&pas=0&cookie14=UoTZ50xcoGm5UQ%3D%3D&tag=8&lng=zh_CN; sg=377; _l_g_=Ug%3D%3D; skt=6264331b9791c61c; cookie1=UNX4ED%2FiUVFGS9qdgVK99M6S3Mxg10yFTM4o03jYmCI%3D; csg=dfb88184; existShop=MTU1MzU2NDcxNg%3D%3D; _nk_=huangxubo23; cookie17=Vvqv90XfYUEw; _m_h5_tk=3823b8beb733aa4e8abe4b35f32b449e_1553598374328; _m_h5_tk_enc=dd712670b0dfe14f2f25c0823d6a885e; isg=BE9Pk0CBT90PFku8eUO_d5ie1eX1ZKfTBUbI0mFc-L7FMG4yaUd25xXhNiArSHsO; l=bBTtt54lvX6xZSXxBOCaZQKb4PQ9bCOfguS...'
    }
  });
}
