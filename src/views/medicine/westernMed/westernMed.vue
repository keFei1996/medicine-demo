<template>
  <div class="z-card-style med-page" @click="boxClick">
    <div class="tool">
      <div class="tool-left">
        <el-button size="small" type="primary" plain @click="savePost">
          保存(ALT+S)</el-button>
        <el-button size="small" type="primary" plain @click="lineAddClick">
          新增行(F2)</el-button>
        <el-button size="small" type="primary" plain @click="lineDelClick">
          删除行(F3)</el-button>
        <el-button size="small" type="primary" plain @click="groupAddClick">
          新增组(F4)</el-button>
        <el-button size="small" type="primary" plain @click="groupDelClick">
          删除组(F5)</el-button>
        <el-button size="small" type="primary" plain>
          刷新</el-button>
        <el-button size="small" type="primary" plain>
          存为模板</el-button>
      </div>
    </div>
    <div class="pres-list">
      <div class="pres-item" :class="[ index === presIndex ? 'active' : '' ]" v-for="(item, index) in form.presList" :key="index" @click="presIndexClick($event, index)">{{ `${index+1}-${item.name}` }}<span class="z-m-l-5 z-font-bold" @click.stop="presDelClick($event, index)">X</span></div>
      <div class="pres-item-icon" @click="presAddClick"><i class="el-icon-circle-plus-outline"></i></div>
    </div>
    <el-form class="my-form" ref="my-form" :rules="rules" v-loading="formLoading" :model="form.presList[presIndex]" :show-message="false" @click.native="formClick">
      <div class="order-table z-table-hasRight">
        <el-table
          :header-cell-class-name="starAdd"
          :header-cell-style="{background:'#F5F7FA',color:'#333'}"
          style="width: 100%"
          :height="45"
          border
          :data="[]"
          @header-dragend="headerDragend">
          <el-table-column
            label="药名标记"
            prop="useUnit"
            align="center"
            :width="widthObj.useUnit"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="药名名称"
            align="center"
            prop="medId"
            :width="widthObj.medId"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="剂型"
            prop="formName"
            align="center"
            :width="widthObj.formName"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="规格"
            prop="spec"
            align="center"
            :width="widthObj.spec"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="产地"
            prop="factoryName"
            align="center"
            :width="widthObj.factoryName"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="用量"
            align="center"
            :width="widthObj.useRatio"
            prop="useRatio"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="剂量"
            align="center"
            :width="widthObj.doseRatio"
            prop="doseRatio"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="用法"
            align="center"
            prop="usage"
            :width="widthObj.usage"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="mode"
            align="center"
            label="给药方式"
            :width="widthObj.mode"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="day"
            label="用药天数"
            align="center"
            :width="widthObj.day"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            label="用药次数"
            prop="rate"
            align="center"
            :width="widthObj.rate"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="presRatio"
            label="配药数量"
            align="center"
            :width="widthObj.presRatio"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            :width="widthObj.remark"
            :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
        <el-collapse class="my-collapse med-table" v-model="activeNames" v-if="form.presList.length > 0">
          <el-collapse-item class="collapse-item" v-for="(group, groupIndex) in form.presList[presIndex].groupList" :key="groupIndex" :title="`第${groupIndex+1}组`" :name="groupIndex">
            <el-table
              :header-cell-style="{background:'#F5F7FA',color:'#333'}"
              style="width: 100%"
              :show-header="false"
              border
              row-key="medId"
              :data="group"
              @cell-click="cellClick"
              :row-class-name="rowClassName"
              :cell-style="cellStyle"
              :row-style="rowStyle">
              <el-table-column
                label="药名标记"
                :width="widthObj.useUnit"
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
                :width="widthObj.medId"
                prop="medId"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.medId`"
                    :rules="{ required: true, message: '请选择药品', trigger: 'change' }">
                    <div class="med-validate-item">
                      <el-select
                        size="small"
                        class="z-select-table"
                        popper-class="z-select-table-option"
                        v-model="row.medId"
                        placeholder="请选择"
                        filterable
                        :filter-method="(val) => filterMethod(val, ['medName', 'inputcode1', 'inputcode2'], 'drugList','drugListCopy')"
                        @visible-change="selectVisible($event, 'medId')"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.medId`"
                        :ref="`groupList.${groupIndex}.${$index}.medId`"
                        @change="selectChange($event, groupIndex, $index, 'medId')">
                        <template>
                          <div class="el-select-dropdown__item z-select-header">
                            <div class="" style="width: 200px">药名名字</div>
                            <div class="" style="width: 80px">规格</div>
                            <div class="" style="width: 50px">单位</div>
                            <div class="" style="width: 60px">剂型</div>
                            <div class="" style="width: 80px">参考库存</div>
                            <div class="" style="width: 50px">单价</div>
                            <div class="" style="width: 90px">产地</div>
                            <div class="" style="width: 90px">拼</div>
                            <div class="" style="width: 90px">笔</div>
                          </div>
                        </template>
                        <el-option
                          v-for="item in drugList"
                          :key="item.medId"
                          :label="item.medName"
                          :value="item.medId">
                          <div class="" style="width: 200px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.medName" placement="bottom-end" :open-delay="1000">
                              <span> {{ item.medName }}</span>
                            </el-tooltip>
                          </div>
                          <div class="" style="width: 80px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.spec" placement="bottom-end" :open-delay="1000">
                              <span>{{ item.spec }}</span>
                            </el-tooltip>
                          </div>
                          <div class="" style="width: 50px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.presUnit" placement="bottom-end" :open-delay="1000">
                              <span>{{ item.presUnit }}</span>
                            </el-tooltip>
                          </div>
                          <div class="" style="width: 60px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.formName" placement="bottom-end" :open-delay="1000">
                              <span>{{ item.formName }}</span>
                            </el-tooltip>
                          </div>
                          <div class="" style="width: 80px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.stockNum + ''" placement="bottom-end" :open-delay="1000">
                              <span>{{ item.stockNum }}</span>
                            </el-tooltip>
                          </div>
                          <div class="" style="width: 50px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.retaPrice + ''" placement="bottom-end" :open-delay="1000">
                              <span>{{ item.retaPrice }}</span>
                            </el-tooltip>
                          </div>
                          <div class="" style="width: 90px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.factoryName" placement="bottom-end" :open-delay="1000">
                              <span>{{ item.factoryName }}</span>
                            </el-tooltip>
                          </div>
                          <div class="" style="width: 90px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.inputcode1" placement="bottom-end" :open-delay="1000">
                              <span>{{ item.inputcode1 }}</span>
                            </el-tooltip>
                          </div>
                          <div class="" style="width: 90px">
                            <el-tooltip class="tooltip-item" effect="dark" :content="item.inputcode2" placement="bottom-end" :open-delay="1000">
                              <span>{{ item.inputcode2 }}</span>
                            </el-tooltip>
                          </div>
                        </el-option>
                      </el-select>
                      <div class="z-med-name" v-else>
                        <span>{{ row.medName }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="剂型"
                prop="formName"
                :width="widthObj.formName"
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
                :width="widthObj.spec"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  <div class="z-med-name">
                    <span>{{ row.spec }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="产地"
                prop="factoryName"
                :width="widthObj.factoryName"
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
                :width="widthObj.useRatio"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.useRatio`"
                    :rules="{ required: true, message: '用量必填且大于0', validator: validateDigits, trigger: 'change' }">
                    <div class="med-validate-item">
                      <el-input
                        type="text"
                        class="z-input-small"
                        size="small"
                        v-model="row.useRatio"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.useRatio`"
                        :ref="`groupList.${groupIndex}.${$index}.useRatio`"
                        :class="[`groupList.${groupIndex}.${$index}.useRatio`]"/>
                      <div class="z-med-name text-right" v-else>
                        <span>{{ row.useRatio }}</span>
                        <span v-if="row.useRatio">{{ row.useUnit }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="doseRatio"
                label="剂量"
                :width="widthObj.doseRatio"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.doseRatio`"
                    :rules="{ required: true, message: '剂量必填且大于0', validator: validateDigits, trigger: 'change' }">
                    <div class="med-validate-item">
                      <el-input
                        type="text"
                        class="z-input-small"
                        size="small"
                        v-model="row.doseRatio"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.doseRatio`"
                        :ref="`groupList.${groupIndex}.${$index}.doseRatio`"/>
                      <div class="z-med-name text-right" v-else>
                        <span>{{ row.doseRatio }}</span>
                        <span v-if="row.doseRatio">{{ row.doseUnit }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="usage"
                label="用法"
                :width="widthObj.usage"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.usage`"
                    :rules=" $index === 0 ? { required: true, message: '请选择用法', trigger: 'change' } : {}">
                    <div class="med-validate-item">
                      <el-select
                        size="small"
                        class="z-select-table"
                        popper-class="z-select-table-option"
                        v-model="row.usage"
                        placeholder="请选择"
                        filterable
                        :filter-method="(val) => filterMethod(val, ['name', 'id'], 'usageList','usageListCopy')"
                        @visible-change="selectVisible($event, 'usage')"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.usage` && $index === 0"
                        :ref="`groupList.${groupIndex}.${$index}.usage`"
                        @change="selectChange($event, groupIndex, $index, 'usage')">
                        <template>
                          <div class="el-select-dropdown__item z-select-header">
                            <div class="z-code">代码</div>
                            <div class="z-name">名称</div>
                          </div>
                        </template>
                        <el-option
                          v-for="item in usageList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          <div class="z-code">{{ item.id }}</div>
                          <div class="z-name">{{ item.name }}</div>
                        </el-option>
                      </el-select>
                      <div class="z-med-name" v-else>
                        <span>{{ $index === 0 ? row.usageName : '-' }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :width="widthObj.mode"
                prop="mode"
                label="给药方式"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.mode`"
                    :rules=" $index === 0 ? { required: true, message: '请选择用药方式', trigger: 'change' } : {}">
                    <div class="med-validate-item">
                      <el-select
                        size="small"
                        class="z-select-table"
                        popper-class="z-select-table-option"
                        v-model="row.mode"
                        placeholder="请选择"
                        filterable
                        :filter-method="(val) => filterMethod(val, ['name', 'id'], 'modeList', 'modeListCopy')"
                        @visible-change="selectVisible($event, 'mode')"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.mode` && $index === 0"
                        :ref="`groupList.${groupIndex}.${$index}.mode`"
                        @change="selectChange($event, groupIndex, $index, 'mode')">
                        <template>
                          <div class="el-select-dropdown__item z-select-header">
                            <div class="z-code">代码</div>
                            <div class="z-name">名称</div>
                          </div>
                        </template>
                        <el-option
                          v-for="item in modeList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                          <div class="z-code">{{ item.id }}</div>
                          <div class="z-name">{{ item.name }}</div>
                        </el-option>
                      </el-select>
                      <div class="z-med-name" v-else>
                        <span>{{ $index === 0 ? row.modeName : '-' }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="day"
                label="用药天数"
                :width="widthObj.day"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.day`"
                    :rules=" $index === 0 ? { required: true, message: '用药天数必填且大于0', validator: validateDigits, trigger: 'change' } : {}">
                    <div class="med-validate-item">
                      <el-input
                        type="text"
                        size="small"
                        v-model="row.day"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.day` && $index === 0"
                        :ref="`groupList.${groupIndex}.${$index}.day`"/>
                      <div class="z-med-name text-right" v-else>
                        <span>{{ $index === 0 ? row.day : '-' }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="rate"
                label="用药次数"
                :width="widthObj.rate"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.rate`"
                    :rules=" $index === 0 ? { required: true, message: '用药次数必填且大于0', validator: validateDigits, trigger: 'change' } : {}">
                    <div class="med-validate-item">
                      <el-input
                        type="text"
                        size="small"
                        v-model="row.rate"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.rate`  && $index === 0"
                        :ref="`groupList.${groupIndex}.${$index}.rate`"/>
                      <div class="z-med-name text-right" v-else><span>{{ $index === 0 ? row.rate : '-' }}</span></div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="presRatio"
                label="配药数量"
                :width="widthObj.presRatio"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.presRatio`"
                    :rules="{ required: true, message: '配药数量必填且大于0', validator: validateDigits, trigger: 'change' }">
                    <div class="med-validate-item">
                      <el-input
                        class="z-input-small"
                        type="text"
                        size="small"
                        v-model="row.presRatio"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.presRatio`"
                        :ref="`groupList.${groupIndex}.${$index}.presRatio`"/>
                      <div class="z-med-name text-right" v-else><span>{{ row.presRatio }}</span><span v-if="row.presRatio">{{ row.presUnit }}</span></div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                :width="widthObj.remark"
                :show-overflow-tooltip="true">
                <template slot-scope="{ row, $index }">
                  <el-form-item
                    :prop="`groupList.${groupIndex}.${$index}.remark`"
                    :rules="{}">
                    <div class="med-validate-item">
                      <el-select
                        class="z-w100"
                        v-model="row.remark"
                        clearable
                        placeholder="请选择"
                        size="small"
                        v-if="focusRowItem === `groupList.${groupIndex}.${$index}.remark`"
                        :ref="`groupList.${groupIndex}.${$index}.remark`"
                        filterable>
                        <el-option v-for="item in remarkList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                      </el-select>
                      <div class="z-med-name" v-else>{{ row.remark }}</div>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
  </div>
</template>

<script src="./westernMed.js">
</script>

<style scoped lang="scss">
  @import "./westernMed";
</style>
