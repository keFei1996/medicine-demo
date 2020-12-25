<template>
  <div class="z-card-style" @click="boxClick">
    <div class="tool">
      <div class="tool-left">
        <el-button size="small" type="primary" plain @click="saveClick">
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
    <ValidationObserver tag="form" ref="my-form">
      <div class="order-table">
        <div class="header">
          <div class="z-item z-flex1">药名标记</div>
          <div class="z-item" style="width: 160px">药名名称</div>
          <div class="z-item z-flex1">剂型</div>
          <div class="z-item z-flex1">规格</div>
          <div class="z-item" style="width: 126px">产地</div>
          <div class="z-item" style="width: 80px">用量</div>
          <div class="z-item" style="width: 120px">剂量</div>
          <div class="z-item z-flex1">用法</div>
          <div class="z-item z-flex1">给药方式</div>
          <div class="z-item" style="width: 70px">用药天数</div>
          <div class="z-item" style="width: 70px">用药次数</div>
          <div class="z-item" style="width: 80px">用药数量</div>
          <div class="z-item z-flex1">备注</div>
        </div>
        <el-collapse class="my-collapse" v-model="activeNames">
          <el-collapse-item class="collapse-item" v-for="(group, groupIndex) in groupList[presIndex]" :key="groupIndex" :title="`第${groupIndex+1}组`" :name="groupIndex">
            <div class="center-group" :class="[ index === itemActive.itemIndex && groupIndex === itemActive.groupIndex ? 'active' : '' ]" v-for="(item, index) in group" :key="index" @click="itemClick(groupIndex, index)">
              <!--            药名标记-->
              <div class="med-validate-item med-flex1">
                <div class="z-med-item" :class="[ `useUnit${groupIndex}${index}`, rowColName === `useUnit${groupIndex}${index}` ? 'active' : '' ]">
                  <div class="z-med-name">{{ item.useUnit }}</div>
                </div>
              </div>
              <!--            药名名称-->
              <ValidationProvider class="med-validate-item" rules="required" v-slot="{ errors, classes }" name="medId" style="width: 160px">
                <div class="z-med-item" :class="[ `medId${groupIndex}${index}`, rowColName === `medId${groupIndex}${index}` ? 'active' : '' ]">
                  <cat-table-select
                    v-model="item.medId"
                    :data="drugList"
                    :columns="medColumns"
                    :props="medProps"
                    @rowChange="tableRowChange($event, groupIndex, index)"
                    :class="classes"></cat-table-select>
                </div>
              </ValidationProvider>
              <!--            剂型-->
              <div class="med-flex1 med-validate-item">
                <div class="z-med-item" :class="[ `formName${groupIndex}${index}`, rowColName === `formName${groupIndex}${index}` ? 'active' : '' ]">
                  <div class="z-med-name">{{ item.formName }}</div>
                </div>
              </div>
              <!--            规格-->
              <div class="med-flex1 med-validate-item">
                <div class="z-med-item">
                  <div class="z-med-name">{{ item.spec }}</div>
                </div>
              </div>
              <!--            产地-->
              <div class="med-flex1 med-validate-item" style="width: 126px">
                <div class="z-med-item">
                  <div class="z-med-name">{{ item.factoryName }}</div>
                </div>
              </div>
              <!--            用量-->
              <ValidationProvider class="med-validate-item" rules="required" v-slot="{ errors, classes }" style="width: 80px" name="useRatio">
                <div class="z-med-item">
<!--                  <input type="text" :value="item.useRatio" :class="classes">-->
                  <el-input type="number" class="z-input-small" :class="classes" size="small" v-model="item.useRatio"/>
                  <span class="z-m-l-5">{{ item.useUnit }}</span>
                </div>
              </ValidationProvider>
              <!--            剂量-->
              <ValidationProvider class="med-validate-item" rules="required" v-slot="{ errors, classes }" style="width: 120px" name="doseRatio">
                <div class="z-med-item">
                  <el-input type="number" class="z-input-small" :class="classes" size="small" v-model="item.doseRatio"/>
                  <span class="z-m-l-5">{{ item.doseUnit }}</span>
                </div>
              </ValidationProvider>
              <!--            用法-->
              <ValidationProvider class="med-flex1 med-validate-item" rules="required" v-slot="{ errors, classes }">
                <div class="z-med-item">
                  <cat-table-select
                    v-model="item.usage"
                    :data="usageList"
                    :columns="usageColumns"
                    :props="usageProps"
                    :class="classes"></cat-table-select>
                </div>
              </ValidationProvider>
              <!--            给药方式-->
              <ValidationProvider class="med-flex1 med-validate-item" rules="required" v-slot="{ errors, classes }" name="mode">
                <div class="z-med-item">
                  <cat-table-select
                    v-model="item.mode"
                    :data="modeList"
                    :columns="usageColumns"
                    :props="usageProps"
                    :class="classes"></cat-table-select>
                </div>
              </ValidationProvider>
              <!--            用药天数-->
              <ValidationProvider class="med-validate-item" rules="required" v-slot="{ errors, classes }" name="day" style="width: 70px">
                <div class="z-med-item">
                  <el-input :class="classes" type="number" size="small" v-model="item.day"/>
                </div>
              </ValidationProvider>
              <!--            用药次数-->
              <ValidationProvider class="med-validate-item" rules="required" v-slot="{ errors, classes }" name="rate" style="width: 70px">
                <div class="z-med-item">
                  <el-input :class="classes" type="number" size="small" v-model="item.rate"/>
                </div>
              </ValidationProvider>
              <!--            用药数量-->
              <ValidationProvider class="med-validate-item" rules="required" v-slot="{ errors, classes }" name="presRatio" style="width: 80px">
                <div class="z-med-item">
                  <el-input :class="classes" class="z-input-small" type="number" size="small" v-model="item.presRatio"/>
                  <span class="z-m-l-5">{{ item.presUnit }}</span>
                </div>
              </ValidationProvider>
              <!--            备注-->
              <ValidationProvider class="med-flex1 med-validate-item" v-slot="{ errors, classes }" name="remark">
                <div class="z-med-item">
                  <el-select :class="classes" v-model="item.remark" clearable placeholder="请选择" size="small">
                    <el-option v-for="item in remarkList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </div>
              </ValidationProvider>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </ValidationObserver>
  </div>
</template>

<script src="./westernMed.js">
</script>

<style scoped lang="scss">
  @import "../../../styles/zPub";
  @import "./westernMed";
</style>
