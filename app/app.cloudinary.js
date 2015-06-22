phinisiApp.config(function (cloudinaryProvider) {
  cloudinaryProvider.config({
    upload_endpoint: 'https://api.cloudinary.com/v1_1/', // default
    cloud_name: 'dvndkaqtk', // required
    upload_preset: 'wjrx5otn', // optional
  });
})