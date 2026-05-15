module Spina
  module Parts
    class StreamFieldContent < Base
      include AttrJson::NestedAttributes

      attr_json :part_type, :string, default: "Spina::Parts::Markdown"
      attr_json :parts, AttrJson::Type::SpinaPartsModel.new, array: true
      attr_json_accepts_nested_attributes_for :parts

      def content_part
        parts&.first
      end

      def label
        type_label = StreamField.component_types.key(part_type) ||
                     part_type.to_s.demodulize
        content_label = content_part&.label.to_s
        content_label.present? ? content_label : type_label
      end
    end
  end
end
