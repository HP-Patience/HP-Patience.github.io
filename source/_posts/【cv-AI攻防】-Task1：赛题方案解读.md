---
title: 【cv-AI攻防】-Task1：赛题方案解读
date: 2024-10-12 22:27:14
tags:
- 计算机视觉
---

# 步骤一：构建YOLO数据集

由于比赛原始数据集较大，我们采样部分数据构建训练集和验证集：
```Python
if os.path.exists('yolo_seg_dataset'):
    shutil.rmtree('yolo_seg_dataset')

os.makedirs('yolo_seg_dataset/train')
os.makedirs('yolo_seg_dataset/valid')

def normalize_polygon(polygon, img_width, img_height):
    return [(x / img_width, y / img_height) for x, y in polygon]

# 采样训练集
for row in training_anno.iloc[:10000].iterrows():
    shutil.copy(row[1].Path, 'yolo_seg_dataset/train')

    img = cv2.imread(row[1].Path)
    img_height, img_width = img.shape[:2]
    txt_filename = os.path.join('yolo_seg_dataset/train/' + row[1].Path.split('/')[-1][:-4] + '.txt')
    with open(txt_filename, 'w') as up:
        for polygon in row[1].Polygons:
            normalized_polygon = normalize_polygon(polygon, img_width, img_height)
            normalized_coords = ' '.join([f'{coord[0]:.3f} {coord[1]:.3f}' for coord in normalized_polygon])
            up.write(f'0 {normalized_coords}\n')
 
 # 采用验证集     
 for row in training_anno.iloc[10000:10150].iterrows():
    shutil.copy(row[1].Path, 'yolo_seg_dataset/valid')

    img = cv2.imread(row[1].Path)
    img_height, img_width = img.shape[:2]
    txt_filename = os.path.join('yolo_seg_dataset/valid/' + row[1].Path.split('/')[-1][:-4] + '.txt')
    with open(txt_filename, 'w') as up:
        for polygon in row[1].Polygons:
            normalized_polygon = normalize_polygon(polygon, img_width, img_height)
            normalized_coords = ' '.join([f'{coord[0]:.3f} {coord[1]:.3f}' for coord in normalized_polygon])
            up.write(f'0 {normalized_coords}\n')
```

# 逐行代码分析

好的，我们逐行分析这段代码，它的主要功能是将训练集和验证集的数据从原始数据集中复制到新的目录中，并将多边形的坐标标准化为相对坐标。

### 代码逐行分析

```python
if os.path.exists('yolo_seg_dataset'):
    shutil.rmtree('yolo_seg_dataset')
```
- **功能**: 检查`yolo_seg_dataset`目录是否存在。如果存在，则使用`shutil.rmtree`删除该目录及其内容。`shutil`常用于文件与目录的处理。
- **目的**: 确保每次运行代码时，数据集是干净的，没有旧的数据。

```python
os.makedirs('yolo_seg_dataset/train')
os.makedirs('yolo_seg_dataset/valid')
```
- **功能**: 创建两个新的子目录`train`和`valid`，用于存放训练集和验证集数据。
- **目的**: 为之后的文件复制和标签文件创建所需的目录结构。

```python
def normalize_polygon(polygon, img_width, img_height):
    return [(x / img_width, y / img_height) for x, y in polygon]
```
- **功能**: 定义一个函数`normalize_polygon`，它接受一个多边形的坐标（列表形式），以及图像的宽度和高度。该函数返回归一化后的坐标，归一化的方式是将每个坐标除以图像的宽度和高度。
- **目的**: ==将坐标转换为相对坐标，使其在不同尺寸的图像中具有一致性==。

```python
# 采样训练集
for row in training_anno.iloc[:10000].iterrows():
```
- **功能**: 遍历`training_anno`数据框的前10000行。`iterrows()`方法用于<font color="#ff0000">逐行迭代数据框</font>，并返回行的索引和行的内容。
- **目的**: 处理训练集中的前10000条数据。

```python
    shutil.copy(row[1].Path, 'yolo_seg_dataset/train')
```
- **功能**: 将当前行的图像文件从原始路径复制到`yolo_seg_dataset/train`目录。
- **目的**: 将图像文件放入训练集目录中。

```python
    img = cv2.imread(row[1].Path)
    img_height, img_width = img.shape[:2]
```
- **功能**: 使用OpenCV读取图像文件，并获取其高度和宽度。
- **目的**: 获取图像的尺寸，以便后续进行坐标归一化。

```python
    txt_filename = os.path.join('yolo_seg_dataset/train/' + row[1].Path.split('/')[-1][:-4] + '.txt')
```
- **功能**: 生成对应的文本文件名，该文件名是基于图像文件名生成的（去掉扩展名并添加`.txt`）。
- **目的**: 为每个图像文件创建一个对应的标签文件。

```python
    with open(txt_filename, 'w') as up:
```
- **功能**: 打开或创建文本文件进行写入，使用`with`语句可以确保文件在写入完成后正确关闭。
- **目的**: 准备写入归一化后的坐标数据。

```python
        for polygon in row[1].Polygons:
            normalized_polygon = normalize_polygon(polygon, img_width, img_height)
```
- **功能**: 遍历当前行的所有多边形坐标，调用`normalize_polygon`函数进行归一化。
- **目的**: 将多边形的坐标转化为相对坐标。

```python
            normalized_coords = ' '.join([f'{coord[0]:.3f} {coord[1]:.3f}' for coord in normalized_polygon])
```
- **功能**: 这是一个列表推导式，用于遍历`normalized_polygon`中的每个坐标`coord`。每个`coord`都是一个包含两个元素的元组（`(x, y)`），表示一个点的坐标。
- **格式化**:
    - `coord[0]:.3f`：将`coord`中的第一个元素（x坐标）==格式化为小数点后三位的浮点数==。
    - `coord[1]:.3f`：将第二个元素（y坐标）格式化为小数点后三位的浮点数。
- **结果**: 列表推导式生成一个字符串列表，其中每个字符串都包含格式化后的坐标，例如：`["0.123 0.456", "0.789 0.012"]`。

```python
            up.write(f'0 {normalized_coords}\n')
```
- **内容**:
	- `'0 '`：这是一个常量字符串，通常用于表示==类别标签==。在YOLO格式中，`0`可能表示某个特定的类别（例如，一个物体的类别，具体取决于数据集的类别定义）。
	- `up`是一个文件对象，通过`with open(...) as up:`创建的。调用`write`方法将构建的字符串写入到文件中。
- **功能**: 将归一化后的坐标写入文本文件。
- **目的**: 保存标签信息，以便YOLO模型使用。

### 验证集处理
接下来的代码与训练集处理相似，只是处理的是验证集数据。它从`training_anno`的第10000到第10150行进行迭代，重复上述步骤，复制图像到`yolo_seg_dataset/valid`目录，并创建相应的标签文件。

```python
# 采用验证集     
for row in training_anno.iloc[10000:10150].iterrows():
    shutil.copy(row[1].Path, 'yolo_seg_dataset/valid')

    img = cv2.imread(row[1].Path)
    img_height, img_width = img.shape[:2]
    txt_filename = os.path.join('yolo_seg_dataset/valid/' + row[1].Path.split('/')[-1][:-4] + '.txt')
    with open(txt_filename, 'w') as up:
        for polygon in row[1].Polygons:
            normalized_polygon = normalize_polygon(polygon, img_width, img_height)
            normalized_coords = ' '.join([f'{coord[0]:.3f} {coord[1]:.3f}' for coord in normalized_polygon])
            up.write(f'0 {normalized_coords}\n')
```

### 总结
这段代码的主要目的是将多边形标注数据从原始数据集中提取出来，规范化并保存到新的训练集和验证集目录中，以供YOLO模型使用。通过归一化坐标，模型可以更好地适应不同尺寸的输入图像。

# 步骤二：写入YOLO配置文件

```Python
with open('yolo_seg_dataset/data.yaml', 'w') as up:
    data_root = os.path.abspath('yolo_seg_dataset/')
    up.write(f'''
path: {data_root}
train: train
val: valid

names:
    0: alter
''')
```

# 逐行代码分析

这一段代码的目的是创建一个名为 `data.yaml` 的配置文件，通常用于YOLO等深度学习模型的数据配置。我们来逐步分析这段代码的结构和含义。

### 代码解析

```python
with open('yolo_seg_dataset/data.yaml', 'w') as up:
```
- **功能**: 使用 `with open(...) as ...:` 语句打开（或创建）一个名为 `data.yaml` 的文件，并以写入模式（`'w'`）打开。`up` 是一个文件对象，用于后续的写入操作。
- **上下文管理**: 使用 `with` 语句可以确保文件在操作完成后自动关闭，避免文件未关闭导致的资源泄漏。

### 2. ==获取数据根路径==
```python
data_root = os.path.abspath('yolo_seg_dataset/')
```
- **功能**: `os.path.abspath(...)` 返回给定路径的==绝对路径==。在这里，它将  `'yolo_seg_dataset/'` 转换为绝对路径并存储在 `data_root` 变量中。
- **示例**: 如果当前工作目录是 `/home/user/projects`，那么 `data_root` 的值将是 `/home/user/projects/yolo_seg_dataset`。

### 3. 写入内容到文件
```python
up.write(f'''
path: {data_root}
train: train
val: valid

names:
    0: alter
''')
```
- **功能**: 使用 `write(...)` 方法将格式化的字符串写入到 `data.yaml` 文件中。字符串的内容使用了多行字符串的语法（即用三个单引号包裹的字符串）。
- **内容解释**:
  - `path: {data_root}`: 写入**数据集**根路径的==绝对路径==。
  - `train: train`: 指定训练数据的子目录名（==相对路径==）。
  - `val: valid`: 指定验证数据的子目录名（==相对路径==）。
  - `names:`: 这是一个字典，用于==映射类别ID到类别名称==。在这里，`0` 映射到类别名称 `alter`。

### 完整内容示例
假设 `data_root` 的绝对路径为 `/home/user/projects/yolo_seg_dataset`，最终写入 `data.yaml` 文件的内容将类似于：
```yaml
path: /home/user/projects/yolo_seg_dataset
train: train
val: valid

names:
    0: alter
```

### 总结
这段代码生成了一个用于YOLO数据集配置的 `data.yaml` 文件，包含了数据集的根路径、训练和验证集的目录，以及类别的映射信息。该配置文件通常用于训练模型，帮助模型了解数据集的结构和类别定义。

# 步骤三：训练YOLO分割模型

```Python
from ultralytics import YOLO

model = YOLO("./yolov8n-seg.pt")  
results = model.train(data="./yolo_seg_dataset/data.yaml", epochs=10, imgsz=640)
```

# 逐行代码分析

以下是对代码的逐行分析：

```python
from ultralytics import YOLO
```
- 这行代码导入了 `ultralytics` 库中的 `YOLO` 类。
- `ultralytics` 是一个用于目标检测的库，提供了易于使用的接口来训练和推理 YOLO 模型，尤其是 `YOLOv8` 模型。
- `YOLO` 类是用于创建并管理 YOLO 模型的类，包括加载预训练模型、训练模型和进行推理。

```python
model = YOLO("./yolov8n-seg.pt")
```
- 这行代码使用 `YOLO` 类创建了一个 `model` 实例。
- `YOLO("./yolov8n-seg.pt")` 加载一个预训练的 YOLOv8 模型，该模型文件是 `yolov8n-seg.pt`。这是 YOLOv8 模型的小型版本（`n` 代表 nano纳米），同时具有分割功能（`-seg` 代表分割任务）。
- 通过这种加载方式，可以直接基于预训练模型进行进一步训练或推理。

```python
results = model.train(data="./yolo_seg_dataset/data.yaml", epochs=10, imgsz=640)
```
- `model.train()` 是 YOLO 模型的训练方法。
- `data="./yolo_seg_dataset/data.yaml"` 指定了用于训练的数据集配置文件。`data.yaml` 文件通常包含训练集、验证集的路径，以及类别名称等信息。
- `epochs=10` 指定模型要进行 10 个==训练周期==（<font color="#ff0000">epochs</font>）。每个周期意味着模型将遍历完整的训练数据集一次。
- `imgsz=640` 设置了输入图像的尺寸为 640 像素。YOLO 模型会将训练数据的图像调整到 640x640 的尺寸进行训练。

训练完成后，`results` 会包含训练过程中的结果和性能指标（如损失值、准确度等），这些结果可以用于评估模型的训练效果。

### 总结

这段代码从 `ultralytics` 库中导入 YOLO 模型，加载了一个 YOLOv8 分割模型，并基于指定的数据集文件进行 10 个周期的训练，使用了 640x640 的图像输入尺寸。

# 步骤四：预测测试集

```Python
from ultralytics import YOLO
import glob
from tqdm import tqdm

model = YOLO("./runs/segment/train6/weights/best.pt")  
test_imgs = glob.glob('./test_set_A_rename/*/*')
```

```Python
Polygon = []
for path in tqdm(test_imgs[:]):
    results = model(path, verbose=False)
    result = results[0]
    if result.masks is None:
        Polygon.append([])
    else:
        Polygon.append([mask.astype(int).tolist() for mask in result.masks.xy])
        
import pandas as pd
submit = pd.DataFrame({
    'Path': [x.split('/')[-1] for x in test_imgs[:]],
    'Polygon': Polygon
})
submit.to_csv('track2_submit.csv', index=None)
```

# 逐行分析代码

这段代码使用预训练的YOLO模型来处理图像集，并将结果保存到CSV文件中。下面是逐行的分析：

```python
from ultralytics import YOLO
import glob
from tqdm import tqdm
```
- **`from ultralytics import YOLO`**: 从 `ultralytics` 库中导入 YOLO 类，这个类用于加载并使用预训练的 YOLO 模型进行推理和处理图像。
- **`import glob`**: `glob` 模块用于文件操作，它可以根据特定的模式匹配文件路径。
- **`from tqdm import tqdm`**: `tqdm` 模块用于显示进度条，常用于长时间运行的循环或任务中，帮助可视化处理进度。

```python
model = YOLO("./runs/segment/train6/weights/best.pt")
```
- 这行代码加载了一个训练好的YOLO模型，权重文件位于 `./runs/segment/train6/weights/best.pt`。这个模型是预训练的权重，专门用于图像分割任务。

```python
test_imgs = glob.glob('./test_set_A_rename/*/*')
```
- 使用 `glob.glob()` 函数获取<font color="#ff0000">所有</font>位于 `./test_set_A_rename/` 路径下的图像文件。
- `'*/*'` 匹配所有子目录中的文件路径，因此它会抓取该目录下所有的图像路径，并存储在 `test_imgs` 列表中。

```python
Polygon = []
for path in tqdm(test_imgs[:]):
    results = model(path, verbose=False)
    result = results[0]
```
- **`Polygon = []`**: 初始化一个空列表 `Polygon`，用于存储每张图片的分割结果。
- **`for path in tqdm(test_imgs[:]):`**: 通过 `tqdm` 包裹循环，遍历 `test_imgs` 中的每个图像路径，并显示进度条。
- **`results = model(path, verbose=False)`**: 调用模型对当前图片（`path`）进行推理，得到分割结果。`verbose=False` 表示不打印详细信息。
- **`result = results[0]`**: YOLO 返回的结果可能包含多张图片（批处理），这里仅取第一个结果（当前处理的图片）。

```python
if result.masks is None:
    Polygon.append([])
else:
    Polygon.append([mask.astype(int).tolist() for mask in result.masks.xy])
```
- **`if result.masks is None:`**: 检查结果是否包含分割的掩码（masks）。如果没有分割掩码（即 `result.masks` 为 `None`），则向 `Polygon` 列表中添加一个空列表。
- **`Polygon.append([mask.astype(int).tolist() for mask in result.masks.xy])`**: 如果存在分割掩码，将掩码的边界坐标（`result.masks.xy`）转换为整数并存储为 Python 列表的形式，然后将其添加到 `Polygon` 列表中。

	==掩码（Mask）==在计算机视觉中是一个非常重要的概念，它通常用于表示图像中的特定区域。掩码的作用是突出或分离出图像中的某些部分（例如物体、背景等），便于后续的处理。掩码通常是一个与原始图像尺寸相同的二值化矩阵，每个像素点要么是 1（代表属于目标区域），要么是 0（代表不属于目标区域）。
	
	在你的代码中，掩码（`mask`）与图像分割任务相关。模型返回的 `mask` 描述的是在图像中哪一部分属于分割出的对象。这些掩码可以是二值化的矩阵，也可以是其对应的轮廓坐标（多边形）。



```python
import pandas as pd
submit = pd.DataFrame({
    'Path': [x.split('/')[-1] for x in test_imgs[:]],
    'Polygon': Polygon
})
submit.to_csv('track2_submit.csv', index=None)
```
- **`import pandas as pd`**: 导入 `pandas` 库，用于处理数据并生成 CSV 文件。
- **`submit = pd.DataFrame({...})`**: 创建一个 pandas 数据框 `submit`，包含两列：
  - `'Path'`: 存储每张图像的<font color="#ff0000">文件名</font>（通过 `x.split('/')[-1]` 从路径中提取文件名）。
  - `'Polygon'`: 存储每张图像的分割结果（存储在 `Polygon` 列表中）。
- **`submit.to_csv('track2_submit.csv', index=None)`**: 将 `submit` 数据框保存为一个名为 `track2_submit.csv` 的 CSV 文件，`index=None` 表示不保存行索引。

### 总结

- 这段代码使用YOLO模型处理一批图像，提取图像中的分割掩码边界（多边形），并将这些结果存储到一个CSV文件中。
- `tqdm` 用来展示处理进度，`pandas` 则用来生成最终的提交文件（`track2_submit.csv`）。
