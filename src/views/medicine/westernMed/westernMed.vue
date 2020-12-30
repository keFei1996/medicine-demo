<template>
  <div class="z-card-style med-page" @click="boxClick">
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
    <ValidationObserver tag="form" ref="my-form" id="my-form">
      <div class="order-table z-table-hasRight">
        <el-table
          :header-cell-class-name="starAdd"
          :header-cell-style="{background:'#F5F7FA',color:'#333'}"
          style="width: 100%"
          :height="45"
          border
          :data="[]">
          <el-table-column
            label="药名标记"
            align="center"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="药名名称"
            align="center"
            width="160px"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="剂型"
            align="center"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="规格"
            align="center"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="产地"
            align="center"
            width="126px"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="用量"
            align="center"
            width="80px"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="剂量"
            align="center"
            width="80px"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="用法"
            align="center"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="给药方式"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="用药天数"
            align="center"
            width="80px"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="用药次数"
            align="center"
            width="80px"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="配药数量"
            align="center"
            width="80px"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
        <el-collapse class="my-collapse med-table" v-model="activeNames" v-if="presList.length > 0">
          <el-collapse-item class="collapse-item" v-for="(group, groupIndex) in presList[presIndex].groupList" :key="groupIndex" :title="`第${groupIndex+1}组`" :name="groupIndex">
            <el-table
              :header-cell-style="{background:'#F5F7FA',color:'#333'}"
              style="width: 100%"
              :show-header="false"
              border
              :data="group"
              @cell-click="cellClick"
              :row-class-name="rowClassName"
              :cell-style="cellStyle"
              :row-style="rowStyle">
              <el-table-column
                label="药名标记"
                align="center"
                prop="useUnit"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  <div class="z-med-name">
                    <span>{{ row.useUnit }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="药名名称"
                width="160px"
                prop="medId"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" rules="required" v-slot="{ errors, classes }" name="medId">
                    <div class="med-validate-item" :class="classes">
                      <cat-table-select
                        v-model="row.medId"
                        :data="drugList"
                        :columns="medColumns"
                        :props="medProps"
                        @rowChange="tableRowChange($event, groupIndex, $index)"
                        v-if="rowColName === `medId${groupIndex}${$index}`"></cat-table-select>
                      <span class="z-med-name" v-else>{{ row.medName }}</span>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
              <el-table-column
                label="剂型"
                prop="formName"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  <div class="z-med-name">
                    <span>{{ row.formName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="规格"
                prop="spec"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  <div class="z-med-name">
                    <span>{{ row.spec }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="产地"
                width="126px"
                prop="factoryName"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  <div class="z-med-name">
                    <span>{{ row.factoryName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="useRatio"
                label="用量"
                width="80px"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" rules="required" v-slot="{ errors, classes }" name="useRatio">
                    <div class="med-validate-item" :class="classes">
                      <el-input type="number" class="z-input-small" size="small" v-model="row.useRatio" v-if="rowColName === `useRatio${groupIndex}${$index}`"/>
                      <div class="z-med-name" v-else>
                        <span>{{ row.useRatio }}</span>
                        <span>{{ row.useUnit }}</span>
                      </div>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
              <el-table-column
                prop="doseRatio"
                label="剂量"
                width="80px"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" rules="required" v-slot="{ errors, classes }" name="doseRatio">
                    <div class="med-validate-item" :class="classes">
                      <el-input type="number" class="z-input-small" size="small" v-model="row.doseRatio" v-if="rowColName === `doseRatio${groupIndex}${$index}`"/>
                      <div class="z-med-name" v-else>
                        <span>{{ row.doseRatio }}</span>
                        <span>{{ row.doseUnit }}</span>
                      </div>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
              <el-table-column
                prop="usage"
                label="用法"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" :rules="`${$index === 0 ? 'required' : ''}`" v-slot="{ errors, classes }" >
                    <div class="med-validate-item" :class="classes">
                      <cat-table-select
                        v-model="row.usage"
                        :data="usageList"
                        :columns="usageColumns"
                        :props="usageProps"
                        v-if="rowColName === `usage${groupIndex}${$index}` && $index === 0"></cat-table-select>
                      <div class="z-med-name" v-else>
                        <span>{{ row.usage }}</span>
                      </div>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
              <el-table-column
                prop="mode"
                label="给药方式"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" :rules="`${$index === 0 ? 'required' : ''}`" v-slot="{ errors, classes }" name="mode">
                    <div class="med-validate-item" :class="classes">
                      <cat-table-select
                        v-model="row.mode"
                        :data="modeList"
                        :columns="usageColumns"
                        :props="usageProps"
                        v-if="rowColName === `mode${groupIndex}${$index}`  && $index === 0"></cat-table-select>
                      <div class="z-med-name" v-else>
                        <span>{{ row.mode }}</span>
                      </div>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
              <el-table-column
                prop="day"
                label="用药天数"
                width="80px"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" :rules="`${$index === 0 ? 'required' : ''}`" v-slot="{ errors, classes }" name="day" >
                    <div class="med-validate-item" :class="classes">
                      <el-input type="number" size="small" v-model="row.day" v-if="rowColName === `day${groupIndex}${$index}`  && $index === 0"/>
                      <div class="z-med-name" v-else>
                        <span>{{ row.day }}</span>
                      </div>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
              <el-table-column
                prop="rate"
                label="用药次数"
                width="80px"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" :rules="`${$index === 0 ? 'required' : ''}`" v-slot="{ errors, classes }" name="rate">
                    <div class="med-validate-item" :class="classes">
                      <el-input type="number" size="small" v-model="row.rate" v-if="rowColName === `rate${groupIndex}${$index}`  && $index === 0"/>
                      <div class="z-med-name" v-else><span>{{ row.rate }}</span></div>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
              <el-table-column
                prop="presRatio"
                label="配药数量"
                width="80px"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" rules="required" v-slot="{ errors, classes }" name="presRatio">
                    <div class="med-validate-item" :class="classes">
                      <el-input class="z-input-small" type="number" size="small" v-model="row.presRatio" v-if="rowColName === `presRatio${groupIndex}${$index}`"/>
                      <div class="z-med-name" v-else><span>{{ row.presRatio }}</span><span>{{ row.presUnit }}</span></div>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <ValidationProvider tag="div" class="med-validate-item" v-slot="{ errors, classes }" name="remark">
                    <div class="med-validate-item" :class="classes">
                      <el-select :class="classes" v-model="row.remarkName" clearable placeholder="请选择" size="small" v-if="rowColName === `remark${groupIndex}${$index}`">
                        <el-option v-for="item in remarkList" :key="item.code" :label="item.name" :value="item.name"></el-option>
                      </el-select>
                      <div class="z-med-name" v-else>{{ row.remarkName }}</div>
                    </div>
                  </ValidationProvider>
                </template>
              </el-table-column>
            </el-table>
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
