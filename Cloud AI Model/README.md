
# Vision Transformer and Convolutional Neural Networks Evaluation


## Models Evaluated

### 1. **ConvNetV1**
   - **Description:** ConvNetV1 is a simpler convolutional neural network with three convolutional layers and four fully connected layers. It is intended to perform basic image classification but is less complex compared to ConvNetV3.
   - **Test Accuracy:** 0.395288
   - **Test Loss:** 1.799548
   
   ### 2. **ConvNetV2**
   - **Description:** ConvNetV2 is an intermediate complexity convolutional neural network with three convolutional layers and four fully connected layers. It is designed to balance model complexity and performance.
   - **Test Accuracy:** 0.298429
   - **Test Loss:** 1.971671


### 3. **ConvNetV3**
   - **Description:** ConvNetV3 is a convolutional neural network with three convolutional layers followed by three fully connected layers. This model was designed to perform image classification tasks, leveraging the hierarchical feature extraction ability of convolutional layers.
   - **Test Accuracy:** 0.371728
   - **Test Loss:** 1.783044


### 4. **VisionTransformer**
   - **Description:** Vision Transformers (ViTs) are a type of neural network designed for image classification tasks. Unlike traditional ConvNets that use convolutional layers, ViTs use transformer architecture, originally developed for natural language processing tasks, to process image data. This model was pre-trained on ImageNet and fine-tuned on the current dataset.
   - **Test Accuracy:** 0.641361
   - **Test Loss:** 1.067152



## Summary

The table below provides a quick overview of the models and their performance metrics:

| Model              | Test Accuracy | Test Loss |
|--------------------|---------------|-----------|
| ConvNetV1          | 0.395288      | 1.799548  |
| ConvNetV2          | 0.298429      | 1.971671  |
| ConvNetV3          | 0.371728      | 1.783044  |
| VisionTransformer  | 0.641361      | 1.067152  |


The Transformer model demonstrated the most promising results after just 5 epochs of training. This was an initial test to identify the best model for our use case. Currently, the models are being trained for 150 epochs to observe any potential improvements. This extended training is being conducted on Kaggle using a P100 GPU.


----------------------------------------------------------------------------------------------------------------------------------------

# New Models
The second table shows better results compared to the first one because the test accuracy of the models is significantly higher. Test accuracy is a measure of how well the model is able to correctly predict the output for the given inputs. Higher accuracy means the model's predictions are more often correct. In the first table, the highest accuracy is 0.641361 (for the VisionTransformer), while in the second table, both models (VisionTransformer and resnet) have an accuracy of 0.845549, which is a substantial improvement.

In the second table, between the VisionTransformer and the resnet model, the VisionTransformer is considered better due to its lower test loss. Test loss is a measure of how far the model's predictions are from the actual values. Lower loss means the model's predictions are closer to the actual values, indicating a better model. In this case, the VisionTransformer has a test loss of 0.640255, which is lower than the resnet model's test loss of 0.816232, making the VisionTransformer the better model according to these metrics.


| Model              | Test Accuracy | Test Loss |
|--------------------|---------------|-----------|
| VisionTransformer  | 0.845549      | 0.640255  |
| resnet             | 0.845549      | 0.816232  |





