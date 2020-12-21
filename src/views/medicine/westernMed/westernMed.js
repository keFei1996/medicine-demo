import { drugList } from "@/views/medicine/westernMed/data";

export default {
  name: "westernMed",
  data() {
    return {
      presList: [{ name: '普通院内处方' }], // 处方列表
      presIndex: 0,
      activeNames: [0],
      groupList: {
        0: [[{}]] // 属性名是处方下表，属性值是具体某个处方的内容
      },
      itemActive: { groupIndex: 0, itemIndex: 0 },
      form: {
        dataList: [
          {  }
        ]
      },
      drugList
    }
  },
  created() {

  },
  methods: {
    // 每一行点击
    itemClick(groupIndex, itemIndex) {
      this.itemActive = { groupIndex, itemIndex };
    },
    postMessage() {
      // b页面
      parent.postMessage(
        { name: 'zhu'},
        "http://localhost:8080"
      );
    },
    presAddClick() {
      this.presList.push({ name: '普通院内处方', groupList: [] });
      this.presIndex = this.presList.length - 1;
      this.groupList[this.presIndex] = [[{}]];
    },
    presDelClick(index) {
      this.presList.splice(index, 1);
      delete this.groupList[index];
      // 当删除当前选中的值时
      if(this.presIndex === index) {
        this.presIndex = this.presList.length - 1
      }
    },
    presIndexClick(index) {
      this.presIndex = index;
    },
    // 新增行
    lineAddClick() {
      const { itemActive, groupList, presIndex } = this;
      groupList[presIndex][itemActive.groupIndex].push({})
    },
    // 删除行
    lineDelClick() {
      const { itemActive, groupList, presIndex } = this;
      groupList[presIndex][itemActive.groupIndex].splice(itemActive.itemIndex, 1)
    },
    // 新增组
    groupAddClick() {
      const { groupList, activeNames, presIndex } = this;
      groupList[presIndex].push([{}]);
      // 添加折叠面板
      activeNames.push(groupList[presIndex].length - 1)
    },
    // 删除组
    groupDelClick() {
      const { itemActive, groupList, activeNames, presIndex } = this;
      groupList[presIndex].splice(itemActive.groupIndex, 1);
      // 删除折叠面板
      activeNames.forEach((ev, index) => {
        if(ev === itemActive.groupIndex) {
          activeNames.splice(index, 1)
        }
      })
    }
  }
}
