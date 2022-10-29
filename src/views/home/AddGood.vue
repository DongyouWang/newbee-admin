<!-- 由于新增商品的表单内容较多，所以不采用弹窗的形式新增商品，转而采用跳转新页面的形式 -->
<template>
  <div class="add">
    <el-card class="add-container">
      <el-form class="goodForm"
               :model="state.goodForm" 
               :rules="state.rules" 
               ref="goodRef" 
               label-width="100px">
        <el-form-item required label="商品分类">
          <!-- 三级联动列表 -->
          <el-cascader :placeholder="state.defaultCate" 
            :props="state.category" 
            @change="handleChangeCate"
            style="width: 300px"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input style="width: 300px" v-model="state.goodForm.goodsName" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品简介" prop="goodsIntro">
          <el-input style="width: 300px" type="textarea" v-model="state.goodForm.goodsIntro" placeholder="请输入商品简介(100字)"></el-input>
        </el-form-item>
        <el-form-item label="商品原价" prop="originalPrice">
          <el-input type="number" min=0 style="width: 300px" v-model="state.goodForm.originalPrice" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="sellingPrice">
          <el-input type="number" min=0 style="width: 300px" v-model="state.goodForm.sellingPrice" placeholder="请输入商品售价"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="stockNum">
          <el-input type="number" min=0 style="width: 300px" v-model="state.goodForm.stockNum" placeholder="请输入商品库存"></el-input>
        </el-form-item>
        <el-form-item label="商品标签" prop="tag">
          <el-input style="width: 300px" v-model="state.goodForm.tag" placeholder="请输入商品小标签"></el-input>
        </el-form-item>
        <el-form-item label="上架状态" prop="goodsSellStatus">
          <el-radio-group v-model="state.goodForm.goodsSellStatus">
            <el-radio label="0">上架</el-radio>
            <el-radio label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item required label="商品主图" prop="goodsCoverImg">
          <el-upload class="avatar-uploader"
                     :action="state.uploadImgServer"
                     accept="jpg,jpeg,png"
                     :headers="{ token: state.token }"
                     :show-file-list="false"
                     :before-upload="handleBeforeUpload"
                     :on-success="handleUrlSuccess"
          >
            <img v-if="state.goodForm.goodsCoverImg"
                 class="avatar" 
                 :src="state.goodForm.goodsCoverImg" 
                 style="width: 100px; height: 100px; border: 1px solid #e9e9e9;"
            >
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情内容">
          <div ref='editor'></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAdd()">{{ state.id ? '立即修改' : '立即创建' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
  import { reactive, ref, toRefs, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
  import WangEditor from 'wangeditor'
  import { ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { localGet, uploadImgServer, uploadImgsServer } from '@/utils'
  import { getCategory } from '@/api/category'
  import { getGoodsDetail, postAddGoods, putUpdateGoods } from '@/api/goods'

  const { proxy } = getCurrentInstance()
  const editor = ref(null) // 富文本编辑器 ref
  const goodRef = ref(null) // 表单 ref
  const route = useRoute()
  const router = useRouter()
  const { id } = route.query // 编辑时传入的商品 id
  const state = reactive({
    uploadImgServer: uploadImgServer, // 上传图片的接口地址，单图上传
    token: localGet('token') || '', // 存在本地的 token
    id: id,
    defaultCate: '', // 默认分类值
    goodForm: { // 商品表单内容
      goodsName: '',
      goodsIntro: '',
      originalPrice: 0,
      sellingPrice: 0,
      stockNum: '',
      goodsSellStatus: '0',
      goodsCoverImg: '',
      tag: ''
    },
    rules: { // 规则
      goodsName: [
        { required: 'true', message: '请填写商品名称', trigger: ['change'] }
      ],
      originalPrice: [
        { required: 'true', message: '请填写商品价格', trigger: ['change'] }
      ],
      sellingPrice: [
        { required: 'true', message: '请填写商品售价', trigger: ['change'] }
      ],
      stockNum: [
        { required: 'true', message: '请填写商品库存', trigger: ['change'] }
      ],
    },
    categoryId: '', // 分类 id
    // 联动组件 props 属性讲解：
    category: { 
      // 是否动态加载子节点，需与 lazyLoad 方法结合使用。由于我们是接口请求的联动，所以需要设置为 true
      lazy: true, 

      // lazyLoad: 加载动态数据的方法，仅在 lazy 为 true 时有效
      // 接收的类型为 function(node, resolve)，node 为当前点击的节点，resolve 为数据加载完成的回调(必须调用)
      // 默认第一次加载的参数 level = 0, value = 0，获取 categoryLevel = 1，parentId = 0 的分类
      // 当你选择某个分类的时候，会再次触发 lazyLoad
      lazyLoad(node, resolve) { 
        const { level = 0, value } = node
        getCategory({
          pageNumber: 1,
          pageSize: 1000,
          categoryLevel: level + 1,
          parentId: value || 0
        }).then(res => {
          const list = res.list
          const nodes = list.map(item => ({
            value: item.categoryId,
            label: item.categoryName,
            leaf: level > 1
          }))
          resolve(nodes)
        })
        // axios.get('/categories', {
        //   params: {
        //     pageNumber: 1,
        //     pageSize: 1000,
        //     categoryLevel: level + 1,
        //     parentId: value || 0
        //   }
        // }).then(res => {
        //   const list = res.list
        //   const nodes = list.map(item => ({
        //     value: item.categoryId,
        //     label: item.categoryName,
        //     leaf: level > 1
        //   }))
        //   resolve(nodes)
        // })
      }
    }
  })
  let instance // wangEditor 实例
  onMounted(() => {
    instance = new WangEditor(editor.value) // 初始化 wangEditor
    instance.config.showLinkImg = false
    instance.config.showLinkImgAlt = false
    instance.config.showLinkImgHref = false
    instance.config.uploadImgMaxSize = 2 * 1024 * 1024 // 最大上传大小 2M 
    instance.config.uploadFileName = 'file' // 上传时，key 值自定义
    instance.config.uploadImgHeaders = {
      token: state.token // 添加 token，否则没有权限调用上传接口
    }
    // 图片返回格式不同，需要自定义返回格式
    instance.config.uploadImgHooks = {
      // 图片上传并返回了结果，想要自己把图片插入到编辑器中
      // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
      customInsert: function(insertImgFn, result) {
        // result 即服务端返回的接口
        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        if (result.data && result.data.length) {
          result.data.forEach(item => insertImgFn(item))
        }
      }
    }
    instance.config.uploadImgServer = uploadImgsServer // 上传接口地址配置
    Object.assign(instance.config, {
      onchange() {
        console.log('change')
      },
    })
    instance.create()
    if (id) {
      // 获取商品详情
      getGoodsDetail(id).then(res => {
        const { goods, firstCategory, secondCategory, thirdCategory } = res
        state.goodForm = {
          goodsName: goods.goodsName,
          goodsIntro: goods.goodsIntro,
          originalPrice: goods.originalPrice,
          sellingPrice: goods.sellingPrice,
          stockNum: goods.stockNum,
          goodsSellStatus: String(goods.goodsSellStatus),
          goodsCoverImg: proxy.$filters.prefix(goods.goodsCoverImg),
          tag: goods.tag
        }
        state.categoryId = goods.goodsCategoryId
        state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
        if (instance) {
          // 初始化商品详情 html
          instance.txt.html(goods.goodsDetailContent)
        }
      })
    }
  })
  onBeforeUnmount(() => {
    // 组件销毁之前，销毁 wangEditor 实例
    instance.destroy()
    instance = null
  })
  // 添加商品方法
  const submitAdd = () => {
    goodRef.value.validate((vaild) => {
      if (vaild) {
        let params = {
          goodsCategoryId: state.categoryId,
          goodsCoverImg: state.goodForm.goodsCoverImg,
          goodsDetailContent: instance.txt.html(),
          goodsIntro: state.goodForm.goodsIntro,
          goodsName: state.goodForm.goodsName,
          goodsSellStatus: state.goodForm.goodsSellStatus,
          originalPrice: state.goodForm.originalPrice,
          sellingPrice: state.goodForm.sellingPrice,
          stockNum: state.goodForm.stockNum,
          tag: state.goodForm.tag
        }
        if (id) {
          params.goodsId = id
          // 修改商品
          putUpdateGoods(params).then(() => {
            ElMessage.success('修改成功')
            router.push({ path: '/goods' })
          })
        }
        // 添加商品
        postAddGoods(params).then(() => {
          ElMessage.success('添加成功')
          router.push({ path: '/goods' })
        })
      }
    })
  }
  // 上传之前，判断一下文件格式
  const handleBeforeUpload = (file) => {
    const sufix = file.name.split('.')[1] || ''
    if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
      ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
      return false
    }
  }
  // 图片上传成功后的回调
  const handleUrlSuccess = (val) => {
    state.goodForm.goodsCoverImg = val.data || ''
  }
  // 联动变化后的回调
  const handleChangeCate = (val) => {
    state.categoryId = val[2] || 0
  }
</script>

<style scoped>
  .add {
    display: flex;
  }
  .add-container {
    flex: 1;
    height: 100%;
  }
  .avatar-uploader {
    width: 100px;
    height: 100px;
    color: #ddd;
    font-size: 30px;
  }
  .avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    padding: 32px 32px;
  }
</style>