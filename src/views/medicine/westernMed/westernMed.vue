<template>
  <div class="z-card-style">
    <div class="tool">
      <div class="tool-left">
        <el-button size="small" type="primary" plain>
          保存</el-button>
        <el-button size="small" type="primary" plain @click="lineAddClick">
          新增行</el-button>
        <el-button size="small" type="primary" plain @click="lineDelClick">
          删除行</el-button>
        <el-button size="small" type="primary" plain @click="groupAddClick">
          新增组</el-button>
        <el-button size="small" type="primary" plain @click="groupDelClick">
          删除组</el-button>
        <el-button size="small" type="primary" plain>
          刷新</el-button>
        <el-button size="small" type="primary" plain>
          存为模板</el-button>
      </div>
    </div>
    <div class="pres-list">
      <div class="pres-item" :class="[ index === presIndex ? 'active' : '' ]" v-for="(item, index) in presList" :key="index" @click="presIndexClick(index)">{{ `${index+1}-${item.name}` }}<span class="z-m-l-5 z-font-bold" @click.stop="presDelClick(index)">X</span></div>
      <div class="pres-item-icon" @click="presAddClick"><i class="el-icon-circle-plus-outline"></i></div>
    </div>
    <div class="order-table">
      <div class="header">
        <div class="z-item" style="width: 100px">药名标记</div>
        <div class="z-item z-flex3">药名名称</div>
        <div class="z-item z-flex2">剂型</div>
        <div class="z-item z-flex2" style="width: 50px">规格</div>
        <div class="z-item z-flex3">产地</div>
        <div class="z-item" style="width: 50px">用量</div>
        <div class="z-item" style="width: 50px">剂量</div>
        <div class="z-item z-flex2">用法</div>
        <div class="z-item z-flex2">给药方式</div>
        <div class="z-item z-flex2">用药天数</div>
        <div class="z-item z-flex2">用药次数</div>
        <div class="z-item z-flex2">用药数量</div>
        <div class="z-item z-flex3">备注</div>
      </div>
      <el-collapse class="my-collapse" v-model="activeNames">
        <el-collapse-item class="collapse-item" v-for="(group, groupIndex) in groupList[presIndex]" :key="groupIndex" :title="`第${groupIndex+1}组`" :name="groupIndex">
          <div class="center-group" :class="[ index === itemActive.itemIndex && groupIndex === itemActive.groupIndex ? 'active' : '' ]" v-for="(item, index) in group" :key="index" @click="itemClick(groupIndex, index)">
            <div class="z-item" style="width: 100px">药名标记</div>
            <div class="z-item z-flex3">药名名称</div>
            <div class="z-item z-flex2">剂型</div>
            <div class="z-item z-flex2" style="width: 50px">规格</div>
            <div class="z-item z-flex3">产地</div>
            <div class="z-item" style="width: 50px">用量</div>
            <div class="z-item" style="width: 50px">剂量</div>
            <div class="z-item z-flex2">用法</div>
            <div class="z-item z-flex2">给药方式</div>
            <div class="z-item z-flex2">用药天数</div>
            <div class="z-item z-flex2">用药次数</div>
            <div class="z-item z-flex2">用药数量</div>
            <div class="z-item z-flex3">备注</div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script src="./westernMed.js">
</script>

<style scoped lang="scss">
  @import "../../../styles/zPub";
  @import "./westernMed";
</style>
